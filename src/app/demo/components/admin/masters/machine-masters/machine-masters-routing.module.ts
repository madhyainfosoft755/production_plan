import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MachineMastersComponent } from './machine-masters.component';

const routes: Routes = [
  { path: '', component: MachineMastersComponent, data: { title: 'Machine Master' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachineMastersRoutingModule { }
