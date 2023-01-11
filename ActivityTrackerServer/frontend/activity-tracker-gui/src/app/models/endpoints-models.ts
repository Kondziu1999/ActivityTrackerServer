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

export interface EndpointBucketQuery {
  endpointName: string;
  timeRange: TimeRange;
  bucketSize: number;
}

export interface EndpointBucket {
  from: number;
  to: number;
  count: number;
}
