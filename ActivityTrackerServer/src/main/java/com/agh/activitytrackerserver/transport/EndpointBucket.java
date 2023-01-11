package com.agh.activitytrackerserver.transport;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EndpointBucket {
    private long from;
    private long to;
    private long count = 0;

    public void incrementCount() {
        this.count++;
    }
}
