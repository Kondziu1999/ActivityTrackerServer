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

    PageResponse<UserLog> getEndpointLogs(EndpointLogsQuery query);
}
