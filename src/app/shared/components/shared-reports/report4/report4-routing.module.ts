import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Report4Component } from './report4.component';

const routes: Routes = [
  { path: '', component: Report4Component, data: { title: 'Main File History' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Report4RoutingModule { }
