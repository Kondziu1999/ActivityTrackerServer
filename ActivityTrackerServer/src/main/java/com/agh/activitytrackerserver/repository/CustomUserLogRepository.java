package com.agh.activitytrackerserver.repository;


import com.agh.activitytrackerserver.transport.EndpointNameWithCount;
import com.agh.activitytrackerserver.transport.EndpointsQuery;

import java.util.List;

public interface CustomUserLogRepository {

    List<EndpointNameWithCount> findMostPopularEndpointNames(EndpointsQuery query);
}
