import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageResponse } from '../models/common-models';
import { Log, LogsForUserQuery, User, UsersOverviewQuery, UserWithActivitiesCount } from '../models/users-models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getUsersOverview(query: UsersOverviewQuery): Observable<PageResponse<UserWithActivitiesCount>> {
    return this.http.post<PageResponse<UserWithActivitiesCount>>(`${this.apiUrl}/getUsersWithOverview`, query);
  }

  public getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/getActivityUserWithoutLogs?userId=${userId}`);
  }

  public getLogsForUser(query: LogsForUserQuery): Observable<PageResponse<Log>> {
    return this.http.post<PageResponse<Log>>(`${this.apiUrl}/getLogsForUser`, query);
  }

}
