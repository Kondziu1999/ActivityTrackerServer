package com.agh.activitytrackerserver.transport;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GetLogsForUserQuery {
    private String userId;
    private int page;
    private int pageSize;
    private String sessionId;
    private TimeRange timeRange;
    private SortingDirection sortingDirection;
}
