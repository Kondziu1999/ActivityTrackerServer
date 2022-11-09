package com.agh.activitytrackerserver.controller;


import com.agh.activitytrackerclient.models.ActivityUser;
import com.agh.activitytrackerclient.models.ActivityUserWithOverviewStatistics;
import com.agh.activitytrackerclient.models.UserLog;
import com.agh.activitytrackerclient.models.UserWithLogsCount;
import com.agh.activitytrackerserver.repository.ActivityUserRepository;
import com.agh.activitytrackerserver.repository.UserLogRepository;
import com.agh.activitytrackerserver.transport.EndpointNameWithCount;
import com.agh.activitytrackerserver.transport.EndpointsQuery;
import com.agh.activitytrackerserver.transport.GetLogsForUserQuery;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
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

    @GetMapping("/getUsersWithOverview")
    public ResponseEntity<List<ActivityUserWithOverviewStatistics>> getActivityUsers(@RequestParam int page, @RequestParam int pageSize) {
        Pageable pageable = PageRequest.of(page,pageSize);

        var usersWithLogsCount = userLogRepository.getUserIdsWithMostActivity(pageable);
        var userIds = usersWithLogsCount.stream().map(UserWithLogsCount::getActivityUserId).collect(Collectors.toList());
        var users = activityUserRepository.findAllById(userIds);

        var usersWithActivity = users.stream().map(user -> {
            var data = new ActivityUserWithOverviewStatistics();
            data.setUser(user);
            data.setActivitiesCount(usersWithLogsCount.stream()
                    .filter(x -> Objects.equals(x.getActivityUserId(), user.getId()))
                    .findFirst()
                    .get()
                    .getLogsCount()
            );
            return data;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(usersWithActivity);
    }

    @PostMapping("/getLogsForUser")
    public ResponseEntity<List<UserLog>> getActivityUsers(@RequestBody() GetLogsForUserQuery query) {
        if(query.getSessionId() == null) {
            var logs = userLogRepository.findAllByActivityUserId(query.getUserId(), PageRequest.of(query.getPage(), query.getPageSize()));
            return ResponseEntity.ok(logs);
        } else {
            var logs = userLogRepository.findAllByActivityUserIdAndUserSessionId(query.getUserId(), query.getSessionId(), PageRequest.of(query.getPage(), query.getPageSize()));
            return ResponseEntity.ok(logs);
        }
    }

    @PostMapping("/getEndpointsWithFilter")
    public ResponseEntity<List<EndpointNameWithCount>> getEndpointsWithFilter(@RequestBody() EndpointsQuery query) {
        return ResponseEntity.ok(userLogRepository.findMostPopularEndpointNames(query));
    }

}
