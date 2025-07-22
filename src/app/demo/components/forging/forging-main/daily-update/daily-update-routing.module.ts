import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyUpdateComponent } from './daily-update.component';

const routes: Routes = [
  { path: '', component: DailyUpdateComponent, data: { title: 'Daily Update' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyUpdateRoutingModule { }
