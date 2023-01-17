import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersComponent } from './users/users.component';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { NavbarComponent } from './navbar/navbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon'
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {HttpClientModule} from "@angular/common/http";
import { EndpointsFilterTableComponent } from './endpoints-filter-table/endpoints-filter-table.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule} from "@angular-material-components/datetime-picker";
import {ReactiveFormsModule} from "@angular/forms";
import { UsersFilterTableComponent } from './users-filter-table/users-filter-table.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UserLogsComponent } from './user-logs/user-logs.component';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import {MatSelectModule} from "@angular/material/select";
import { ActivitiesCountChartComponent } from './user-logs/activities-count-chart/activities-count-chart.component';
import { EndpointDetailsComponent } from './endpoint-details/endpoint-details.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    EndpointsComponent,
    NavbarComponent,
    EndpointsFilterTableComponent,
    UsersFilterTableComponent,
    UserLogsComponent,
    ActivitiesCountChartComponent,
    EndpointDetailsComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        HttpClientModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        ReactiveFormsModule,
        NgxChartsModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatSelectModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
