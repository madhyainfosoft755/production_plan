import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./this-month/this-month.module').then(m => m.ForgingThisMonthModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then(m => m.ForgingHistoryModule)
  },
  {
    path: 'daily-update',
    loadChildren: () => import('./daily-update/daily-update.module').then(m => m.DailyUpdateModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
