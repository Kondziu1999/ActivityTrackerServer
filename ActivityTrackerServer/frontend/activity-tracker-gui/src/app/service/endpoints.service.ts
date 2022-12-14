import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EndpointNameWithCount, EndpointsQuery} from "../models/endpoints-models";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {PageResponse} from "../models/common-models";

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getEndpoints(query: EndpointsQuery): Observable<PageResponse<EndpointNameWithCount>> {
    return this.http.post<PageResponse<EndpointNameWithCount>>(`${this.apiUrl}/getEndpointsWithFilter`, query);
  }
}
