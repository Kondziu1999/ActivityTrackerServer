package com.agh.activitytrackerserver.transport;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EndpointHitCountPerUserQuery {
    private int page;
    private int pageSize;
    private TimeRange timeRange;
    private String endpointName;
}
