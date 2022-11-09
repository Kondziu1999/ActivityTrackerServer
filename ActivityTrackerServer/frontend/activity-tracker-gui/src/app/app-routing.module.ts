import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SamplreComponent} from "./samplre/samplre.component";

const routes: Routes = [
  {
    path: "sample", component: SamplreComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
