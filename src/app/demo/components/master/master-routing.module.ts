import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { sharedRoutes } from 'src/app/shared/shared-routes';

const routes: Routes = [
  { path: '', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
  ...sharedRoutes
  // { path: 'masters', loadChildren: () => import('../admin/masters/masters.module').then(m => m.MastersModule) },
  // { path: 'machines', loadChildren: () => import('../admin/machines/machines.module').then(m => m.MachinesModule) },
  // { path: 'others', loadChildren: () => import('../admin/others/others.module').then(m => m.OthersModule) },
  // { path: 'sap', loadChildren: () => import('../admin/sap/sap.module').then(m => m.SapModule) },
  // { path: 'mainfile', loadChildren: () => import('../admin/main/main.module').then(m => m.MainModule) },
  // { path: 'reports', loadChildren: () => import('../../../shared/components/shared-reports/shared-reports.module').then(m => m.SharedReportsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
