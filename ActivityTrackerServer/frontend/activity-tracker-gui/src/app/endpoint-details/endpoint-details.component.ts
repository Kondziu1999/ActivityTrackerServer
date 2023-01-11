import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { SortingDirection } from '../models/common-models';
import { EndpointBucket, EndpointBucketQuery, EndpointHitCountPerUserQuery, EndpointLogsQuery, EndpointNameWithCount } from '../models/endpoints-models';
import { EndpointHitCountPerUser } from '../models/users-models';
import { EndpointsService } from '../service/endpoints.service';
import { getTimeRangeFromTimesForm, getTimesForm } from '../utils/date-utils';
import { EndpointHitCountPerUserDs } from '../utils/endpoint-hit-count-per-user-ds';
import { EndpointLogsDs } from '../utils/endpoint-logs-ds';

@Component({
  selector: 'app-endpoint-details',
  templateUrl: './endpoint-details.component.html',
  styleUrls: ['./endpoint-details.component.scss']
})
export class EndpointDetailsComponent implements OnInit, AfterViewInit {
  public endpointName: string;

  form: FormGroup = new FormGroup({
    ...getTimesForm().controls
  });

  public endpointHitsCount$: Observable<EndpointNameWithCount>;
  public endpointBuckets$: Observable<EndpointBucket[]>;

  public endpointLogsDs: EndpointLogsDs;
  public endpointLogsDisplayedColumns: string[] = ['userSessionId', 'activityStart', 'activityEnd'];
  public defaultEndpointLogsQuery: EndpointLogsQuery;
  public logsResultsLength = 0;
  @ViewChild('logsPaginator') logsPaginator: MatPaginator;

  public endpointHitCountPerUserDs: EndpointHitCountPerUserDs
  public endpointHitCountPerUserDisplayedColumns: string[] = ['userId', 'count'];
  public defaultEndpointHitCountPerUserQuery: EndpointHitCountPerUserQuery;
  public endpointHitCountPerUserResultsLength = 0;
  @ViewChild('userHitsPaginator') userHitsPaginator: MatPaginator;

  constructor(private router: Router, private route: ActivatedRoute, private endpointsService: EndpointsService) { }

  public ngAfterViewInit(): void {
    merge(
      this.logsPaginator.page,
      this.form.valueChanges
    )
    .pipe(
      map(() => {
        const query: EndpointLogsQuery = {
          endpointName: this.endpointName,
          page: this.logsPaginator.pageIndex,
          pageSize: this.logsPaginator.pageSize,
          timeRange: getTimeRangeFromTimesForm(this.form),
          sortingDirection: SortingDirection.Desc
        }
        return query;
      }),
      startWith(this.defaultEndpointLogsQuery),
      switchMap(query =>
        this.endpointLogsDs.loadLogs(query)
      ),
      tap(data => {
        this.logsResultsLength = data.totalResults;
      }),
    )
    .subscribe();

    merge(
      this.userHitsPaginator.page,
      this.form.valueChanges
    )
    .pipe(
      map(() => {
        const query: EndpointHitCountPerUserQuery = {
          endpointName: this.endpointName,
          page: this.logsPaginator.pageIndex,
          pageSize: this.logsPaginator.pageSize,
          timeRange: getTimeRangeFromTimesForm(this.form)
        }
        return query;
      }),
      startWith(this.defaultEndpointHitCountPerUserQuery),
      switchMap(query =>
        this.endpointHitCountPerUserDs.loadData(query)
      ),
      tap(data => {
        this.endpointHitCountPerUserResultsLength = data.totalResults;
      }),
    )
    .subscribe();
  }

  public ngOnInit(): void {
    this.endpointName = this.route.snapshot.paramMap.get('name');

    this.endpointLogsDs = new EndpointLogsDs(this.endpointsService);

    this.defaultEndpointLogsQuery = {
      endpointName: this.endpointName,
      page: 0,
      pageSize: 10,
      timeRange: getTimeRangeFromTimesForm(this.form),
      sortingDirection: SortingDirection.Desc,
    };

    this.endpointHitCountPerUserDs = new EndpointHitCountPerUserDs(this.endpointsService);

    this.defaultEndpointHitCountPerUserQuery = {
      page: 0,
      pageSize: 10,
      endpointName:  this.endpointName,
      timeRange: getTimeRangeFromTimesForm(this.form),
    };

    this.endpointHitsCount$ = this.form.valueChanges.pipe(
      startWith(() => this.form.value),
      switchMap(() => this.endpointsService.getEndpointHitCount({
        endpointName: this.endpointName,
        timeRange: getTimeRangeFromTimesForm(this.form),
      })));
    
    this.endpointBuckets$ = this.form.valueChanges.pipe(
      startWith(() => this.form.value),
      switchMap(() => this.endpointsService.getEndpointBuckets({
        endpointName: this.endpointName,
        timeRange: getTimeRangeFromTimesForm(this.form),
        bucketSize: 10000
      } as EndpointBucketQuery))
    );
  }

  public goBackToEndpoints(): void {
    this.router.navigate(['/endpoints']);
  }

  public navigateToUserDetails(element: EndpointHitCountPerUser): void {
    this.router.navigate(['/logs-for-user', element.userId]);
  }

}
