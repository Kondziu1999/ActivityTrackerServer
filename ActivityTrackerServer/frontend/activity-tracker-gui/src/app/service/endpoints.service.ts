import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EndpointBucket, EndpointBucketQuery, EndpointHitCountPerUserQuery, EndpointHitCountQuery, EndpointLogsQuery, EndpointNameWithCount, EndpointsQuery} from "../models/endpoints-models";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {PageResponse} from "../models/common-models";
import { EndpointHitCountPerUser, Log } from '../models/users-models';

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getEndpoints(query: EndpointsQuery): Observable<PageResponse<EndpointNameWithCount>> {
    return this.http.post<PageResponse<EndpointNameWithCount>>(`${this.apiUrl}/getEndpointsWithFilter`, query);
  }

  public getEndpointHitCount(query: EndpointHitCountQuery): Observable<EndpointNameWithCount> {
    return this.http.post<EndpointNameWithCount>(`${this.apiUrl}/getEndpointHitsCount`, query);
  }

  public getEndpointHitCountPerUser(query: EndpointHitCountPerUserQuery): Observable<PageResponse<EndpointHitCountPerUser>> {
    return this.http.post<PageResponse<EndpointHitCountPerUser>>(`${this.apiUrl}/getEndpointUserHitCount`, query);
  }

  public getEndpointLogs(query: EndpointLogsQuery): Observable<PageResponse<Log>> {
    return this.http.post<PageResponse<Log>>(`${this.apiUrl}/getEndpointLogs`, query);
  }

  public getEndpointBuckets(query: EndpointBucketQuery): Observable<EndpointBucket[]> {
    return this.http.post<EndpointBucket[]>(`${this.apiUrl}/getEndpointBuckets`, query);
  }
}
