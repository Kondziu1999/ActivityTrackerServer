import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize, tap } from "rxjs/operators";
import { PageResponse } from "../models/common-models";
import { EndpointHitCountPerUserQuery, EndpointLogsQuery } from "../models/endpoints-models";
import { EndpointHitCountPerUser, Log } from "../models/users-models";
import { EndpointsService } from "../service/endpoints.service";

export class EndpointHitCountPerUserDs implements DataSource<EndpointHitCountPerUser> {
    private endpointHitCountPerUser = new BehaviorSubject<EndpointHitCountPerUser[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    constructor(private endpointsService: EndpointsService) {}

    connect(collectionViewer: CollectionViewer): Observable<EndpointHitCountPerUser[]> {
        return this.endpointHitCountPerUser.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.endpointHitCountPerUser.complete();
        this.loadingSubject.complete();
    }

    public loadData(query: EndpointHitCountPerUserQuery): Observable<PageResponse<EndpointHitCountPerUser>> {
        this.loadingSubject.next(true);

        return this.endpointsService.getEndpointHitCountPerUser(query)
            .pipe(
                catchError(() => of({ page: [], totalResults: 0 })),
                tap(result => this.endpointHitCountPerUser.next(result.page)),
                finalize(() => this.loadingSubject.next(false))
            );
    }
    
}