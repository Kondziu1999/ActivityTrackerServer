package com.agh.activitytrackerserver.transport;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLogsCountPerEndpointQuery {
    private int page;
    private int pageSize;
    private TimeRange timeRange;
    private String userId;
    private SortingDirection sortingDirection;
}
