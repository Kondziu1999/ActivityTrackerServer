import {SortingDirection, TimeRange} from "./common-models";

export interface EndpointNameWithCount {
  name: string;
  logsCount: number;
}

export interface EndpointsQuery {
  page: number;
  pageSize: number;
  sortingProperty: EndpointSortingProperty;
  sortingDirection: SortingDirection;
  timeRange?: TimeRange;
  endpointName?: string;
  activityUserId?: string;
  sessionId? :string;
}

export enum EndpointSortingProperty {
  ActivityFrequency
}

export interface EndpointHitCountQuery {
  endpointName: string;
  timeRange: TimeRange;
}

export interface EndpointHitCountPerUserQuery {
  page: number;
  pageSize: number;
  endpointName: string;
  timeRange: TimeRange;
}

export interface EndpointLogsQuery {
  endpointName: string;
  page: number;
  pageSize: number;
  timeRange: TimeRange;
  sortingDirection: SortingDirection;
}
