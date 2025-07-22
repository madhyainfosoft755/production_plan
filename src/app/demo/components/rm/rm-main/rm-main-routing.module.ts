import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./this-month/this-month.module').then(m => m.RMThisMonthModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then(m => m.RMHistoryModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
