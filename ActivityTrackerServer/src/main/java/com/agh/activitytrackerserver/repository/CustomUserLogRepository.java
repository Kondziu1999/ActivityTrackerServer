package com.agh.activitytrackerserver.repository;


import com.agh.activitytrackerclient.models.UserLog;
import com.agh.activitytrackerclient.models.UserWithLogsCount;
import com.agh.activitytrackerserver.transport.*;

import java.util.List;

public interface CustomUserLogRepository {

    EndpointHitCount getEndpointHitCount(EndpointHitCountQuery query);

    PageResponse<EndpointHitCountPerUser> getEndpointHitCountPerUser(EndpointHitCountPerUserQuery query);

    PageResponse<EndpointNameWithCount> findMostPopularEndpointNames(EndpointsQuery query);

    PageResponse<UserWithLogsCount> getUserIdsWithMostActivity(UsersWithOverviewQuery query);

    List<UserLog> getAllUserLogs(String userId, TimeRange timeRange, SortingDirection sortingDirection);

    PageResponse<UserLog> getUserLogs(GetLogsForUserQuery query);

    PageResponse<UserLog> getEndpointLogs(EndpointLogsQuery query);

    List<UserLog> getUserLogsForTimeRangeAsc(String userId, TimeRange timeRange);

    PageResponse<EndpointNameWithCount> getUserLogsCountPerEndpoint(UserLogsCountPerEndpointQuery query);
}
