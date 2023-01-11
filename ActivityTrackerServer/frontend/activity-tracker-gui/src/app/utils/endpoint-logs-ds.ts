import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize, tap } from "rxjs/operators";
import { PageResponse } from "../models/common-models";
import { EndpointLogsQuery } from "../models/endpoints-models";
import { Log } from "../models/users-models";
import { EndpointsService } from "../service/endpoints.service";

export class EndpointLogsDs implements DataSource<Log> {
    private endpointLogsSubject = new BehaviorSubject<Log[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    constructor(private endpointsService: EndpointsService) {}

    connect(collectionViewer: CollectionViewer): Observable<Log[]> {
        return this.endpointLogsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.endpointLogsSubject.complete();
        this.loadingSubject.complete();
    }

    public loadLogs(query: EndpointLogsQuery): Observable<PageResponse<Log>> {
        this.loadingSubject.next(true);

        return this.endpointsService.getEndpointLogs(query)
            .pipe(
                catchError(() => of({ page: [], totalResults: 0 })),
                tap(result => this.endpointLogsSubject.next(result.page)),
                finalize(() => this.loadingSubject.next(false))
            );
    }
    
}