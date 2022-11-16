package com.agh.activitytrackerserver.repository;


import com.agh.activitytrackerclient.models.UserWithLogsCount;
import com.agh.activitytrackerserver.transport.EndpointNameWithCount;
import com.agh.activitytrackerserver.transport.EndpointsQuery;
import com.agh.activitytrackerserver.transport.PageResponse;
import com.agh.activitytrackerserver.transport.UsersWithOverviewQuery;

import java.util.List;

public interface CustomUserLogRepository {

    PageResponse<EndpointNameWithCount> findMostPopularEndpointNames(EndpointsQuery query);

    PageResponse<UserWithLogsCount> getUserIdsWithMostActivity(UsersWithOverviewQuery query);
}
