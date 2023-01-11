import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EndpointDetailsComponent } from './endpoint-details/endpoint-details.component';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { UserLogsComponent } from './user-logs/user-logs.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: "",
    component: UsersComponent
  },
  {
    path: "endpoints",
    component: EndpointsComponent
  },
  {
    path: "logs-for-user/:id",
    component: UserLogsComponent
  },
  {
    path: "endpoint-details/:name",
    component: EndpointDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
