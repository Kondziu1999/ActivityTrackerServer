package com.agh.activitytrackerserver.transport;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class TimeRange {
    private Long from;
    private Long to;
}
