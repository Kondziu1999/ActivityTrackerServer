package com.agh.activitytrackerserver.transport;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLogsCountQuery {
    private String userId;
    private TimeRange timeRange;
    private long bucketSize; // In milis as timestamp
}
