import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {merge, Observable} from 'rxjs';
import {map, startWith, switchMap, tap} from 'rxjs/operators';
import {LogsForUserQuery, User, UserLogsCountBucket, UserSessionStats} from '../models/users-models';
import {UsersService} from '../service/users.service';
import {LogsDs} from './logs-ds';
import {FormControl, FormGroup} from "@angular/forms";
import {getTimeRangeFromTimesForm, getTimesForm} from "../utils/date-utils";
import {SortingDirection} from "../models/common-models";
import {EndpointsDs} from "../endpoints/endpoints-ds";
import {EndpointsService} from "../service/endpoints.service";
import {EndpointSortingProperty, EndpointsQuery} from "../models/endpoints-models";

@Component({
  selector: 'app-user-logs',
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.scss']
})
export class UserLogsComponent implements OnInit, AfterViewInit {
  public userId: string;
  public user: User;

  form: FormGroup = new FormGroup({
    ...getTimesForm().controls,
    session: new FormControl(undefined)
  })
  public defaultLogsQuery: LogsForUserQuery;
  public defaultEndpointsQuery: EndpointsQuery;

  userSessionStats$: Observable<UserSessionStats>;
  userLogCountBuckets$: Observable<UserLogsCountBucket[]>;

  readonly logsDisplayedColumns: string[] = ['userSessionId', 'endpoint', 'activityStart', 'activityEnd'];

  logsResultsLength = 0;
  isLoadingResults = true;
  isLogsRateLimitReached = false;

  @ViewChild('logsPaginator') logsPaginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  public logsDs: LogsDs;
  public endpointsDs: EndpointsDs;

  public get sessionIdControl() {
    return this.form.get('session');
  }

  constructor(
    private usersService: UsersService,
    private endpointsService: EndpointsService,
    private route:ActivatedRoute,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');

    this.usersService.getUser(this.userId).subscribe(result => {
      this.user = result;
    });

    this.logsDs = new LogsDs(this.usersService);

    this.defaultLogsQuery = {
      userId: +this.userId,
      page: 0,
      pageSize: 10,
      timeRange: getTimeRangeFromTimesForm(this.form),
      sessionId: undefined,
      sortingDirection: SortingDirection.Desc,
    };

    this.defaultEndpointsQuery = {
      activityUserId: this.userId,
      page: 0,
      pageSize: 10,
      timeRange: getTimeRangeFromTimesForm(this.form),
      sortingDirection: SortingDirection.Desc,
      sortingProperty: EndpointSortingProperty.ActivityFrequency
    };

    this.logsDs.loadLogs(this.defaultLogsQuery);
    this.endpointsDs = new EndpointsDs(this.endpointsService);

    this.userSessionStats$ = this.form.valueChanges.pipe(
      startWith(() => this.form.value),
      switchMap(() => this.usersService.getUserSessionStats({
        userId: this.userId,
        timeRange: getTimeRangeFromTimesForm(this.form),
      }))
    );

    this.userLogCountBuckets$ = this.form.valueChanges.pipe(
      startWith(() => this.form.value),
      switchMap(() => this.usersService.getUserLogsCountBuckets({
        userId: this.userId,
        timeRange: getTimeRangeFromTimesForm(this.form),
        bucketSize: 10000, // milis
        sessionId: this.sessionIdControl.value ?? undefined
      }))
    );
  }

  public ngAfterViewInit(): void {
    merge(
      this.logsPaginator.page,
      this.form.valueChanges
    )
    .pipe(
      map(() => {
        const query: LogsForUserQuery = {
          userId: +this.userId,
          page: this.logsPaginator.pageIndex,
          pageSize: this.logsPaginator.pageSize,
          sessionId: this.form.get('session').value ?? undefined,
          sortingDirection: SortingDirection.Desc,
          timeRange: getTimeRangeFromTimesForm(this.form)
        }
        return query;
      }),
      startWith(this.defaultLogsQuery),
      switchMap(query =>
        this.logsDs.loadLogs(query)
      ),
      tap(data => {
        this.isLoadingResults = false;
        this.isLogsRateLimitReached = data.page.length === 0;
        this.logsResultsLength = data.totalResults;
      }),
    )
    .subscribe();
  }

  public goBackToUsers(): void {
    this.router.navigate(['']);
  }

}
