import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {EndpointSortingProperty, EndpointsQuery} from "../models/endpoints-models";
import {SortingDirection} from "../models/common-models";
import {MatPaginator} from "@angular/material/paginator";
import {EndpointsDs} from "../endpoints/endpoints-ds";
import {EndpointsService} from "../service/endpoints.service";
import {MatSort} from '@angular/material/sort';
import {fromEvent, merge} from "rxjs";
import {debounceTime, distinctUntilChanged, map, startWith, switchMap, tap} from "rxjs/operators";
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {getTimesForm, getYesterday, getTimeRangeFromTimesForm} from "../utils/date-utils";
import { Router } from '@angular/router';
import { EndpointNameWithCount } from "../models/endpoints-models";

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

  @Input() forUserId: string | undefined;
  // Default control to make merge below happy
  @Input() sessionIdControl: AbstractControl = new FormControl(undefined);

  private _timesForm = getTimesForm();

  @Input() set timesForm(form: FormGroup) {
    if(form) {
      this.externalTimesForm = true
      this._timesForm = form;
    }
  }
  get timesForm() {
    return this._timesForm;
  }

  externalTimesForm: boolean;

  readonly displayedColumns: string[] = ['position', 'endpoint', 'logsCount'];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  endpointsDs: EndpointsDs

  constructor(private endpointsService: EndpointsService, private router: Router) {}

  ngOnInit() {
    this.endpointsDs = new EndpointsDs(this.endpointsService);
  }

  public navigateToEndpointDetails(endpointNameWithCount: EndpointNameWithCount): void {
    this.router.navigate(['/endpoint-details', endpointNameWithCount.name]);
  }

  ngAfterViewInit(): void {
    this.endpointsDs.loadEndpoints({...defaultQuery, activityUserId: this.forUserId ?? undefined});

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    const inputChange = fromEvent(this.input.nativeElement,'keyup').pipe(
      distinctUntilChanged(),
      debounceTime(150),
    ).pipe(tap(() => this.paginator.pageIndex = 0));

    merge(
      this.sort.sortChange,
      this.paginator.page,
      inputChange,
      this._timesForm.valueChanges,
      this.sessionIdControl.valueChanges,
    )
      .pipe(
        debounceTime(100),
        map(() => {
          const query: EndpointsQuery = {
            page: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            endpointName: this.input.nativeElement.value ?? null,
            sortingDirection: this.sort.direction === 'asc' ? SortingDirection.Asc : SortingDirection.Desc,
            sortingProperty: EndpointSortingProperty.ActivityFrequency,
            timeRange: getTimeRangeFromTimesForm(this._timesForm),
            activityUserId: this.forUserId ?? null,
            sessionId: this.sessionIdControl?.value ?? null
          }
          return query;
        }),
        startWith({...defaultQuery, activityUserId: this.forUserId ?? undefined}),
        switchMap(query =>
          this.endpointsDs.loadEndpoints(query)
        ),
        tap(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data.page.length === 0;
          this.resultsLength = data.totalResults;
        }),
      )
      .subscribe();

  }

}
