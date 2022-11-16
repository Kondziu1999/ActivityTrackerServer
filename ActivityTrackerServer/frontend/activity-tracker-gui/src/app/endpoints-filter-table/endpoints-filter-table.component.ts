import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {EndpointSortingProperty, EndpointsQuery} from "../models/endpoints-models";
import {SortingDirection} from "../models/common-models";
import {MatPaginator} from "@angular/material/paginator";
import {EndpointsDs} from "../endpoints/endpoints-ds";
import {EndpointsService} from "../service/endpoints.service";
import {MatSort} from '@angular/material/sort';
import {fromEvent, merge} from "rxjs";
import {debounceTime, distinctUntilChanged, map, startWith, switchMap, tap} from "rxjs/operators";
import {FormControl, FormGroup} from "@angular/forms";

function getYesterday(): Date {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  return yesterday;
}
const defaultQuery: EndpointsQuery = {
  page:0,
  pageSize: 10,
  sortingProperty: EndpointSortingProperty.ActivityFrequency,
  sortingDirection: SortingDirection.Desc,
  timeRange: {
    from: getYesterday().getTime(),
    to: new Date().getTime()
  }
};

@Component({
  selector: 'app-endpoints-filter-table',
  templateUrl: './endpoints-filter-table.component.html',
  styleUrls: ['./endpoints-filter-table.component.scss']
})
export class EndpointsFilterTableComponent implements AfterViewInit, OnInit {

  @Input() forUserId: string = null;

  private today = new Date();
  private yesterday = getYesterday();

  timesForm: FormGroup = new FormGroup({
    from: new FormControl(this.yesterday), // yesterday
    to: new FormControl(this.today)
  });

  readonly displayedColumns: string[] = ['position', 'endpoint', 'logsCount'];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  endpointsDs: EndpointsDs

  constructor(private endpointsService: EndpointsService) {}

  ngOnInit() {
    this.endpointsDs = new EndpointsDs(this.endpointsService);
    this.endpointsDs.loadEndpoints(defaultQuery);
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    const inputChange = fromEvent(this.input.nativeElement,'keyup').pipe(
      distinctUntilChanged(),
      debounceTime(150),
    ).pipe(tap(() => this.paginator.pageIndex = 0));

    merge(
      this.sort.sortChange,
      this.paginator.page,
      inputChange,
      this.timesForm.valueChanges,
    )
      .pipe(
        map(() => {
          const query: EndpointsQuery = {
            page: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            endpointName: this.input.nativeElement.value ?? null,
            sortingDirection: this.sort.direction === 'asc' ? SortingDirection.Asc : SortingDirection.Desc,
            sortingProperty: EndpointSortingProperty.ActivityFrequency,
            timeRange: {
              from: (this.timesForm.get("from").value as Date).getTime(),
              to: (this.timesForm.get("to").value as Date).getTime(),
            },
            activityUserId: this.forUserId ?? null
          }
          return query;
        }),
        startWith(defaultQuery),
        switchMap(query =>
          this.endpointsDs.loadEndpoints(query)
        ),
        tap(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data.page === [];
          this.resultsLength = data.totalResults;
        }),
      )
      .subscribe();

  }

}
