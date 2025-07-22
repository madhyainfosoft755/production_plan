import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Report2Component } from './report2.component';

const routes: Routes = [
  { path: '', component: Report2Component, data: { title: 'Main File History' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Report2RoutingModule { }
