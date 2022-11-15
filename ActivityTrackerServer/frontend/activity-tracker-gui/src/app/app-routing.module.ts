import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: "",
    component: UsersComponent
  },
  {
    path: "endpoints",
    component: EndpointsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
