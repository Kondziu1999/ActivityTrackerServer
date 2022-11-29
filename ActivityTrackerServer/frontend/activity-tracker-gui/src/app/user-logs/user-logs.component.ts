import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { LogsForUserQuery, User } from '../models/users-models';
import { UsersService } from '../service/users.service';
import { LogsDs } from './logs-ds';

@Component({
  selector: 'app-user-logs',
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.scss']
})
export class UserLogsComponent implements OnInit, AfterViewInit {
  public userId: string;
  public user: User;

  public defaultQuery: LogsForUserQuery;

  readonly displayedColumns: string[] = ['userSessionId', 'endpoint', 'activityStart', 'activityEnd'];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  public logsDs: LogsDs;

  constructor(
    private usersService: UsersService,
    private route:ActivatedRoute,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');

    this.usersService.getUser(this.userId).subscribe(result => {
      this.user = result;
    });

    this.logsDs = new LogsDs(this.usersService);

    this.defaultQuery = {
      userId: +this.userId,
      page: 0,
      pageSize: 10
    };

    this.logsDs.loadLogs(this.defaultQuery);
  }

  public ngAfterViewInit(): void {
    // const inputChange = fromEvent(this.input.nativeElement,'keyup')
    // .pipe(
    //   distinctUntilChanged(),
    //   debounceTime(150),
    // )
    // .pipe(
    //   tap(() => this.paginator.pageIndex = 0)
    // );

    merge(
      this.paginator.page,
      // inputChange
    )
    .pipe(
      map(() => {
        const query: LogsForUserQuery = {
          userId: +this.userId,
          page: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
          sessionId: this.input.nativeElement.value ?? null,
        }
        return query;
      }),
      startWith(this.defaultQuery),
      switchMap(query =>
        this.logsDs.loadLogs(query)
      ),
      tap(data => {
        this.isLoadingResults = false;
        this.isRateLimitReached = data.page.length === 0;
        this.resultsLength = data.totalResults;
      }),
    )
    .subscribe();
  }

  public goBackToUsers(): void {
    this.router.navigate(['']);
  }

}
