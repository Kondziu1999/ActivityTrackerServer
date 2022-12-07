package com.agh.activitytrackerserver.transport;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserSessionsStats {
    private List<String> sessions;
    private int sessionsCount;
    private int maximumActivityCountsPerSession;
    private int minimumActivityCountsPerSession;
    private int totalActivitiesCount;
    private String mostPopularEndpoint;
    private int mostPopularEndpointCount;
}
