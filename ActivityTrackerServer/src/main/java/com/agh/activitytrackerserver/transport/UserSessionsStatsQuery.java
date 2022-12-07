package com.agh.activitytrackerserver.transport;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserSessionsStatsQuery {
    private String userId;
    private TimeRange timeRange;
}
