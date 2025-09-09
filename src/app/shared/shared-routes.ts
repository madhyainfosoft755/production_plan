import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/guards/permission-grard';

export const sharedRoutes: Routes = [
    { path: 'employees', 
      canActivate: [PermissionGuard],
                data: { role: ['ADMIN'] },
      loadChildren: () => import('../demo/components/admin/employees/employees.module').then(m => m.EmployeesModule) },
    { path: 'masters', 
      canActivate: [PermissionGuard],
                data: { role: ['ADMIN', 'MASTER'], permission: 'FullControlOnMasters' },
      loadChildren: () => import('../demo/components/admin/masters/masters.module').then(m => m.MastersModule) },
    
    {
      path: 'masters/',
      canActivate: [PermissionGuard],
                data: { role: ['ADMIN', 'MASTER'], permission: 'ManageWorkOrderMaster' },
      loadChildren: () => import('../demo/components/admin/masters/work-order-masters/work-order-masters.module').then(m => m.WorkOrderMastersModule)
    },
    {
      path: 'masters/product-master',
      canActivate: [PermissionGuard],
                data: { role: ['ADMIN', 'MASTER'], permission: 'ManageProductMaster' },
      loadChildren: () => import('../demo/components/admin/masters/product-masters/product-masters.module').then(m => m.ProductMastersModule)
    },
    {
      path: 'masters/machine-master',
      canActivate: [PermissionGuard],
                data: { role: ['ADMIN', 'MASTER'], permission: 'ManageMachineMaster' },
      loadChildren: () => import('../demo/components/admin/masters/machine-masters/machine-masters.module').then(m => m.MachineMastersModule)
    },
    {
      path: 'masters/work-order-master',
      canActivate: [PermissionGuard],
                data: { role: ['ADMIN', 'MASTER'], permission: 'ManageWorkOrderMaster' },
      loadChildren: () => import('../demo/components/admin/masters/work-order-masters/work-order-masters.module').then(m => m.WorkOrderMastersModule)
    },


    { path: 'machines', 
      canActivate: [PermissionGuard],
                data: { role: ['ADMIN', 'MASTER'], permission: 'FullControlOnMasters' },
      loadChildren: () => import('../demo/components/admin/machines/machines.module').then(m => m.MachinesModule) },

    { path: 'machines', 
      canActivate: [PermissionGuard],
                data: { role: ['ADMIN', 'MASTER'], permission: 'ManageMachineMaster' },
      loadChildren: () => import('../demo/components/admin/machines/machines.module').then(m => m.MachinesModule) },
    { path: 'others', 
      canActivate: [PermissionGuard],
      data: { role: ['ADMIN', 'MASTER'], permission: 'ManageOthers' },
      loadChildren: () => import('../demo/components/admin/others/others.module').then(m => m.OthersModule) },
    { path: 'sap', 
      canActivate: [PermissionGuard],
                data: { role: ['ADMIN', 'MASTER'], permission: 'UploadSAPFile' },
      loadChildren: () => import('../demo/components/admin/sap/sap.module').then(m => m.SapModule) },
    { path: 'mainfile', 
      canActivate: [PermissionGuard],
                data: { role: ['ADMIN', 'PLANNER', 'USER'], permission: 'FullControlOnMainFile' },
      loadChildren: () => import('../demo/components/admin/main/main.module').then(m => m.MainModule) },
    { path: 'reports', 
      canActivate: [PermissionGuard],
                data: { role: ['ADMIN', 'VIEWER'], permission: 'AllReports' },
      loadChildren: () => import('./components/shared-reports/shared-reports.module').then(m => m.SharedReportsModule) },

    { path: 'logs', 
      canActivate: [PermissionGuard],
                data: { role: ['ADMIN', 'MASTER'], permission: 'ViewLogs' },
      loadChildren: () => import('./components/log-viewer/log-viewer.module').then(m => m.LogViewerModule) 
      },

    // { path: 'plant-machine-booking', 
    //   canActivate: [PermissionGuard],
    //             data: { role: ['ADMIN', 'VIEWER'], permission: 'AllReports' },
    //   loadChildren: () => import('./components/shared-reports/plant-machine-booking/plant-machine-booking.module').then(m => m.PlantMachineBookingModule) 
    //   }
];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class SharedRoutingModule { }
