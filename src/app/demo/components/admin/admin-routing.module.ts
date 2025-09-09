import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/guards/permission-grard';
import { sharedRoutes } from 'src/app/shared/shared-routes';

const routes: Routes = [
    { path: '', 
      canActivate: [PermissionGuard],
                      data: { role: 'ADMIN', alwaysAllow: true },
      loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
    ...sharedRoutes
    // { path: 'masters', 
    //   canActivate: [PermissionGuard],
    //             data: { role: 'ADMIN', permission: 'FullControlOnMasters' },
    //   loadChildren: () => import('./masters/masters.module').then(m => m.MastersModule) },
    // { path: 'employees', 
    //   canActivate: [PermissionGuard],
    //             data: { role: 'ADMIN' },
    //   loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesModule) },
    // { path: 'machines', 
    //   canActivate: [PermissionGuard],
    //             data: { role: 'ADMIN', permission: 'FullControlOnMasters' },
    //   loadChildren: () => import('./machines/machines.module').then(m => m.MachinesModule) },
    // { path: 'others', 
    //   canActivate: [PermissionGuard],
    //             data: { role: 'ADMIN', permission: 'ManageOthers' },
    //   loadChildren: () => import('./others/others.module').then(m => m.OthersModule) },
    // { path: 'sap', 
    //   canActivate: [PermissionGuard],
    //             data: { role: 'ADMIN', permission: 'UploadSAPFile' },
    //   loadChildren: () => import('./sap/sap.module').then(m => m.SapModule) },
    // { path: 'mainfile', 
    //   canActivate: [PermissionGuard],
    //             data: { role: 'ADMIN', permission: 'FullControlOnMainFile' },
    //   loadChildren: () => import('./main/main.module').then(m => m.MainModule) },
    // { path: 'reports', 
    //   canActivate: [PermissionGuard],
    //             data: { role: 'ADMIN', permission: 'AllReports' },
    //   loadChildren: () => import('../../../shared/components/shared-reports/shared-reports.module').then(m => m.SharedReportsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
