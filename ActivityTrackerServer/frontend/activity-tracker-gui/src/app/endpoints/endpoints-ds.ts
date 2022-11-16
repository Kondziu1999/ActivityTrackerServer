import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {EndpointNameWithCount, EndpointsQuery} from "../models/endpoints-models";
import {BehaviorSubject, Observable, of} from "rxjs";
import {EndpointsService} from "../service/endpoints.service";
import {catchError, finalize, tap} from "rxjs/operators";
import {PageResponse} from "../models/common-models";

export class EndpointsDs implements DataSource<EndpointNameWithCount> {

  private endpointNamesSubject = new BehaviorSubject<EndpointNameWithCount[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private endpointsService: EndpointsService) {}

  connect(collectionViewer: CollectionViewer): Observable<EndpointNameWithCount[]> {
    return this.endpointNamesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.endpointNamesSubject.complete();
    this.loadingSubject.complete();
  }

  loadEndpoints(query: EndpointsQuery): Observable<PageResponse<EndpointNameWithCount>> {
    this.loadingSubject.next(true);

    return this.endpointsService.getEndpoints(query).pipe(
      catchError(() => of({page: [], totalResults: 0})),
      tap(x => this.endpointNamesSubject.next(x.page)),
      finalize(() => this.loadingSubject.next(false)),
    );
  }
}
