package com.agh.activitytrackerserver.repository;


import com.agh.activitytrackerclient.models.UserWithLogsCount;
import com.agh.activitytrackerserver.transport.EndpointNameWithCount;
import com.agh.activitytrackerserver.transport.EndpointsQuery;
import com.agh.activitytrackerserver.transport.UsersWithOverviewQuery;

import java.util.List;

public interface CustomUserLogRepository {

    List<EndpointNameWithCount> findMostPopularEndpointNames(EndpointsQuery query);

    List<UserWithLogsCount> getUserIdsWithMostActivity(UsersWithOverviewQuery query);
}
