import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'group-target',
    loadChildren: () => import('./group-target/group-target-routing.module').then(m => m.GroupTargetRoutingModule)
  },
  {
    path: 'group-segment',
    loadChildren: () => import('./group-segment/group-segment-routing.module').then(m => m.GroupSegmentRoutingModule)
  },
  {
    path: 'group-details',
    loadChildren: () => import('./group-details/group-details-routing.module').then(m => m.GroupDetailsRoutingModule)
  },
  {
    path: 'report4',
    loadChildren: () => import('./report4/report4-routing.module').then(m => m.Report4RoutingModule)
  },
  {
    path: 'daily-output',
    loadChildren: () => import('./daily-output/daily-output-routing.module').then(m => m.DailyOutputRoutingModule)
  },
  { path: 'plant-machine-booking', 
              data: { role: ['ADMIN', 'VIEWER'], permission: 'AllReports' },
    loadChildren: () => import('./plant-machine-booking/plant-machine-booking.module').then(m => m.PlantMachineBookingModule) 
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedReportsRoutingModule { }
