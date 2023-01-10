package com.agh.activitytrackerserver.controller;


import com.agh.activitytrackerclient.models.ActivityUser;
import com.agh.activitytrackerclient.models.ActivityUserWithOverviewStatistics;
import com.agh.activitytrackerclient.models.UserLog;
import com.agh.activitytrackerclient.models.UserWithLogsCount;
import com.agh.activitytrackerserver.repository.ActivityUserRepository;
import com.agh.activitytrackerserver.repository.UserLogRepository;
import com.agh.activitytrackerserver.transport.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/monitoring")
public class GuiController {

    private final ActivityUserRepository activityUserRepository;
    private final UserLogRepository userLogRepository;

    public GuiController(ActivityUserRepository activityUserRepository, UserLogRepository userLogRepository) {

        this.activityUserRepository = activityUserRepository;
        this.userLogRepository = userLogRepository;
    }

    @GetMapping("/getActivityUserWithoutLogs")
    public ResponseEntity<ActivityUser> getActivityUser(@RequestParam String userId) {
        var user = activityUserRepository.findById(userId);

        return ResponseEntity.ok(user.get());
    }

    @PostMapping("/getUsersWithOverview")
    public ResponseEntity<PageResponse<ActivityUserWithOverviewStatistics>> getActivityUsers(@RequestBody() UsersWithOverviewQuery query) {

        var usersWithLogsCount = userLogRepository.getUserIdsWithMostActivity(query);
        var userIds = usersWithLogsCount.getPage().stream().map(UserWithLogsCount::getActivityUserId).collect(Collectors.toList());
        var users = activityUserRepository.findAllById(userIds);

        var usersWithActivity = users.stream().map(user -> {
            var data = new ActivityUserWithOverviewStatistics();
            data.setUser(user);
            data.setActivitiesCount(usersWithLogsCount.getPage().stream()
                    .filter(x -> Objects.equals(x.getActivityUserId(), user.getId()))
                    .findFirst()
                    .get()
                    .getLogsCount()
            );
            return data;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(new PageResponse<>(usersWithActivity, usersWithLogsCount.getTotalResults()));
    }

    @PostMapping("/getLogsForUser")
    public ResponseEntity<PageResponse<UserLog>> getLogsForUser(@RequestBody() GetLogsForUserQuery query) {
        return ResponseEntity.ok(userLogRepository.getUserLogs(query));
    }

    // General stats without session id filter
    @PostMapping("/getUserSessionsStats")
    public ResponseEntity<UserSessionsStats> getUserSessionsStats(@RequestBody() UserSessionsStatsQuery query) {
        var sessionsMap = new HashMap<String, List<UserLog>>();
        var endpointsMap = new HashMap<String, Integer>();

        var logs = userLogRepository.getAllUserLogs(query.getUserId(), query.getTimeRange(), SortingDirection.DESC);

        for (var log : logs) {
            if(!endpointsMap.containsKey(log.getEndpoint())) {
                endpointsMap.put(log.getEndpoint(), 1);
            } else {
                endpointsMap.put(log.getEndpoint(), endpointsMap.get(log.getEndpoint()) + 1);
            }

            if(!sessionsMap.containsKey(log.getUserSessionId())) {
                var list = new LinkedList<UserLog>();
                list.add(log);
                sessionsMap.put(log.getUserSessionId(), list);
            }
            sessionsMap.get(log.getUserSessionId()).add(log);
        }

        var sessionsCount = sessionsMap.size();
        var maximumActivityCountsPerSession = Integer.MIN_VALUE;
        var minimumActivityCountsPerSession = Integer.MAX_VALUE;
        var totalActivitiesCount = 0;
        var mostPopularEndpoint = "";
        var mostPopularEndpointCount = 0;

        for(var key : sessionsMap.keySet()) {
            var logsForSession = sessionsMap.get(key);
            var logsForSessionSize = logsForSession.size();
            totalActivitiesCount += logsForSession.size();

            if(logsForSessionSize < minimumActivityCountsPerSession) {
                minimumActivityCountsPerSession = logsForSessionSize;
            }
            if(logsForSessionSize > maximumActivityCountsPerSession) {
                maximumActivityCountsPerSession =logsForSessionSize;
            }
        }

        for(var key : endpointsMap.keySet()) {
            var count = endpointsMap.get(key);

            if(mostPopularEndpointCount < count) {
                mostPopularEndpointCount = count;
                mostPopularEndpoint = key;
            }
        }

        return ResponseEntity.ok(
            new UserSessionsStats(
                new ArrayList<>(sessionsMap.keySet()),
                sessionsCount,
                maximumActivityCountsPerSession,
                minimumActivityCountsPerSession,
                totalActivitiesCount,
                mostPopularEndpoint,
                mostPopularEndpointCount
            )
        );
    }

    @PostMapping("/getUserLogsCount")
    public ResponseEntity<LinkedList<UserLogsCountBucket>> getUserLogsCount(@RequestBody() UserLogsCountQuery query) {
        var logs = userLogRepository.getUserLogsForTimeRangeAsc(query.getUserId(), query.getTimeRange(), query.getSessionId());

        var buckets = new LinkedList<UserLogsCountBucket>();


        if(logs.size() > 0) {

            var firstTimestamp = logs.get(0).getActivityEnd();
            var lastTimestamp = logs.get(logs.size() - 1).getActivityEnd();

            if(firstTimestamp - query.getBucketSize() > query.getTimeRange().getFrom()) {
                var startBucket = new UserLogsCountBucket();
                startBucket.setFrom(query.getTimeRange().getFrom());
                startBucket.setTo(query.getTimeRange().getFrom() + query.getBucketSize());
                buckets.add(startBucket);
            }

            // To decrease interpolation interference
            if(firstTimestamp - 2 * query.getBucketSize() > query.getTimeRange().getFrom()) {
                var startBucket = new UserLogsCountBucket();
                startBucket.setFrom(firstTimestamp - 2 * query.getBucketSize());
                startBucket.setTo(firstTimestamp - query.getBucketSize());
                buckets.add(startBucket);
            }

            while (firstTimestamp <= lastTimestamp) {
                var bucket = new UserLogsCountBucket();
                bucket.setFrom(firstTimestamp);
                bucket.setTo(firstTimestamp + query.getBucketSize());
                firstTimestamp = firstTimestamp + query.getBucketSize();
                buckets.add(bucket);
            }

            // To decrease interpolation interference
            if(query.getTimeRange().getTo() > lastTimestamp + 2 * query.getBucketSize()) {
                var endBucket = new UserLogsCountBucket();
                endBucket.setFrom(lastTimestamp + query.getBucketSize());
                endBucket.setTo(lastTimestamp + 2 * query.getBucketSize());
                buckets.add(endBucket);
            }

            if(query.getTimeRange().getTo() > lastTimestamp + query.getBucketSize()) {
                var endBucket = new UserLogsCountBucket();
                endBucket.setFrom(query.getTimeRange().getTo() - query.getBucketSize());
                endBucket.setTo(query.getTimeRange().getTo());
                buckets.add(endBucket);
            }

            var currentBucketIdx = 0;

            for(var log : logs) {
                while (log.getActivityEnd() > buckets.get(currentBucketIdx).getTo()) {
                    currentBucketIdx += 1;
                }
                buckets.get(currentBucketIdx).incrementCount();
            }
        }
        return ResponseEntity.ok(buckets);
    }

    @PostMapping("/getUserLogsCountPerEndpoint")
    public ResponseEntity<PageResponse<EndpointNameWithCount>> getUserLogsCountPerEndpoint(@RequestBody UserLogsCountPerEndpointQuery query) {
        return ResponseEntity.ok(userLogRepository.getUserLogsCountPerEndpoint(query));
    }

    @PostMapping("/getEndpointsWithFilter")
    public ResponseEntity<PageResponse<EndpointNameWithCount>> getEndpointsWithFilter(@RequestBody() EndpointsQuery query) {
        return ResponseEntity.ok(userLogRepository.findMostPopularEndpointNames(query));
    }

    @PostMapping("/getEndpointHitsCount")
    public ResponseEntity<EndpointHitCount> getEndpointHitsForThisEndpointSince(@RequestBody() EndpointHitCountQuery query) {
        return ResponseEntity.ok(userLogRepository.getEndpointHitCount(query));
    }

    @PostMapping("/getEndpointUserHitCount")
    public ResponseEntity<PageResponse<EndpointHitCountPerUser>> getEndpointUserHits(@RequestBody() EndpointHitCountPerUserQuery query) {
        return ResponseEntity.ok(userLogRepository.getEndpointHitCountPerUser(query));
    }

    @PostMapping("/getEndpointLogs")
    public ResponseEntity<?> getEndpointLogs(@RequestBody() EndpointLogsQuery query) {
        return ResponseEntity.ok(userLogRepository.getEndpointLogs(query));
    }

}
