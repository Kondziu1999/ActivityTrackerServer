package com.agh.activitytrackerserver.transport;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsersWithOverviewQuery {
    private int page;
    private int pageSize;
    private TimeRange timeRange;
    private SortingDirection sortingDirection;
}
