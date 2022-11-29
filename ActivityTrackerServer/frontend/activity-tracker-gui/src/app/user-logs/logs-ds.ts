import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize, tap } from "rxjs/operators";
import { PageResponse } from "../models/common-models";
import { Log, LogsForUserQuery } from "../models/users-models";
import { UsersService } from "../service/users.service";

export class LogsDs implements DataSource<Log> {
    private userLogsSubject = new BehaviorSubject<Log[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    constructor(private usersService: UsersService) {}

    connect(collectionViewer: CollectionViewer): Observable<Log[]> {
        return this.userLogsSubject.asObservable();;
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.userLogsSubject.complete();
        this.loadingSubject.complete();
    }

    public loadLogs(query: LogsForUserQuery): Observable<PageResponse<Log>> {
        this.loadingSubject.next(true);

        return this.usersService.getLogsForUser(query)
            .pipe(
                catchError(() => of({ page: [], totalResults: 0 })),
                tap(result => this.userLogsSubject.next(result.page)),
                finalize(() => this.loadingSubject.next(false))
            );
    }
    
}