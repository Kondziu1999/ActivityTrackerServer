import { SortingDirection, TimeRange } from "./common-models";

export interface Log {
    id: number;
    activityUserId: string;
    userSessionId: string;
    activityStart: number;
    activityEnd: number;
    endpoint: string;
};

export interface LogsForUserQuery {
    userId: number;
    page: number;
    pageSize: number;
    sessionId?: string;
    timeRange: TimeRange;
    sortingDirection: SortingDirection;
};

export interface User {
    id: string;
    userLogs: Log[];
    name: string;
    email: string;
    username: string;
};

export interface UserWithActivitiesCount {
    user: User;
    activitiesCount: number;
};

export interface UsersOverviewQuery {
    page: number;
    pageSize: number;
    username?: string;
    timeRange?: TimeRange;
    sortingDirection: SortingDirection;
};

export interface UserSessionStatsQuery {
  userId: string;
  timeRange: TimeRange;
}

export interface UserSessionStats {
  sessions: string[],
  sessionsCount: number,
  maximumActivityCountsPerSession: number,
  minimumActivityCountsPerSession: number,
  totalActivitiesCount: number,
  mostPopularEndpoint: string,
  mostPopularEndpointCount: number
}

export interface UserLogsCountPerEndpointQuery {
  page: number;
  pageSize: number;
  timeRange: TimeRange;
  userId: string;
  sortingDirection: SortingDirection;
}

export interface UserLogsCountQuery {
  userId: string;
  timeRange: TimeRange;
  bucketSize: number;
  sessionId?: string;
}

export interface UserLogsCountBucket {
  from: number;
  to: number;
  count: number;
}
