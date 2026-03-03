import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinishWisePlanningComponent } from './finish-wise-planning.component';

const routes: Routes = [
  { path: '', component: FinishWisePlanningComponent, data: { title: 'Report | Finish Wise Planning' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinishWisePlanningRoutingModule { }
