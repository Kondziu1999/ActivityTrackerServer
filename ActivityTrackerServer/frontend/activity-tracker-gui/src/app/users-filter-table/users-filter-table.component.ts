import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { SortingDirection } from '../models/common-models';
import { UsersOverviewQuery, UserWithActivitiesCount } from '../models/users-models';
import { UsersService } from '../service/users.service';
import { UsersDs } from '../users/users-ds';

function getYesterday(): Date {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  return yesterday;
}

const defaultQuery: UsersOverviewQuery = {
  page: 0,
  pageSize: 10,
  timeRange: {
    from: getYesterday().getTime(),
    to: new Date().getTime()
  },
  sortingDirection: SortingDirection.Desc,
};

@Component({
  selector: 'app-users-filter-table',
  templateUrl: './users-filter-table.component.html',
  styleUrls: ['./users-filter-table.component.scss']
})
export class UsersFilterTableComponent implements AfterViewInit, OnInit {
  private today = new Date();
  private yesterday = getYesterday();

  timesForm: FormGroup = new FormGroup({
    from: new FormControl(this.yesterday),
    to: new FormControl(this.today)
  });

  readonly displayedColumns: string[] = ['position', 'userId', 'username', 'email', 'name', 'activitiesCount'];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  usersDs: UsersDs;

  constructor(private usersService: UsersService, private router: Router) { }

  public ngOnInit(): void {
    this.usersDs = new UsersDs(this.usersService);
    this.usersDs.loadUsers(defaultQuery);
  }

  public ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(
      () => (this.paginator.pageIndex = 0)
    );

    const inputChange = fromEvent(this.input.nativeElement,'keyup')
    .pipe(
      distinctUntilChanged(),
      debounceTime(150),
    )
    .pipe(
      tap(() => this.paginator.pageIndex = 0)
    );
    
    merge(
      this.sort.sortChange,
      this.paginator.page,
      inputChange,
      this.timesForm.valueChanges
    )
    .pipe(
      map(() => {
        const query: UsersOverviewQuery = {
          page: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
          username: this.input.nativeElement.value ?? null,
          timeRange: {
            from: (this.timesForm.get("from").value as Date).getTime(),
            to: (this.timesForm.get("to").value as Date).getTime(),
          },
          sortingDirection: this.sort.direction === 'asc' ? SortingDirection.Asc : SortingDirection.Desc
        }
        return query;
      }),
      startWith(defaultQuery),
      switchMap(query =>
        this.usersDs.loadUsers(query)
      ),
      tap(data => {
        this.isLoadingResults = false;
        this.isRateLimitReached = data.page.length === 0;
        this.resultsLength = data.totalResults;
      }),
    )
    .subscribe();
  }

  public navigateToUserLogs(userWithActivitiesCount: UserWithActivitiesCount): void {
    this.router.navigate(['/logs-for-user', userWithActivitiesCount.user.id]);
  }

}
