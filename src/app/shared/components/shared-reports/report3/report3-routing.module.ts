import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Report3Component } from './report3.component';

const routes: Routes = [
  { path: '', component: Report3Component, data: { title: 'Main File History' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Report3RoutingModule { }
