package com.agh.activitytrackerserver.transport;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EndpointsQuery {
    private int page;
    private int pageSize;
    private EndpointSortingProperty sortingProperty;
    private SortingDirection sortingDirection;
    private TimeRange timeRange;
    // Optionals
    private String endpointName;
    private String activityUserId;
    private String sessionId;
}
