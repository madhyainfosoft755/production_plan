import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddWeeklyPlanningComponent } from 'src/app/shared/components/add-weekly-planning/add-weekly-planning.component';
import { DailyUpdateComponent } from 'src/app/shared/components/daily-update/daily-update.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./this-month/this-month.module').then(m => m.ThisMonthModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then(m => m.HistoryModule)
  },
  {
    path: 'daily-update',
    component: DailyUpdateComponent
  },
  {
    path: 'weekly-planning',
    component: AddWeeklyPlanningComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
