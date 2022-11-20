import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize, tap } from "rxjs/operators";
import { PageResponse } from "../models/common-models";
import { UserWithActivitiesCount, UsersOverviewQuery } from "../models/users-models";
import { UsersService } from "../service/users.service";

export class UsersDs implements DataSource<UserWithActivitiesCount> {
    private usersWithActivitiesCountSubject = new BehaviorSubject<UserWithActivitiesCount[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    constructor(private usersService: UsersService) {}

    public connect(collectionViewer: CollectionViewer): Observable<UserWithActivitiesCount[]> {
        return this.usersWithActivitiesCountSubject.asObservable();
    }
    public disconnect(collectionViewer: CollectionViewer): void {
        this.usersWithActivitiesCountSubject.complete();
        this.loadingSubject.complete();
    }

    public loadUsers(query: UsersOverviewQuery): Observable<PageResponse<UserWithActivitiesCount>> {
        this.loadingSubject.next(true);

        return this.usersService.getUsersOverview(query)
            .pipe(
                catchError(() => of({ page: [], totalResults: 0 })),
                tap(result => this.usersWithActivitiesCountSubject.next(result.page)),
                finalize(() => this.loadingSubject.next(false))
            );
    }
    
}