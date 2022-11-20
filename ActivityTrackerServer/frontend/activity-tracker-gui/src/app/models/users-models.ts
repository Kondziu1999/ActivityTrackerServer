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
    timeRange?: TimeRange;
    sortingDirection: SortingDirection;
};
