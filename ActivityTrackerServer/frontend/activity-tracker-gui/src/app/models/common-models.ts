export interface TimeRange {
  from: number;
  to: number;
}
export enum SortingDirection {
  Asc,
  Desc,
}

export interface PageResponse<T> {
  page: T[],
  totalResults: number;
}
