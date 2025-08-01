import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'report2',
    loadChildren: () => import('./report2/report2-routing.module').then(m => m.Report2RoutingModule)
  },
  {
    path: 'report3',
    loadChildren: () => import('./report3/report3-routing.module').then(m => m.Report3RoutingModule)
  },
  {
    path: 'report4',
    loadChildren: () => import('./report4/report4-routing.module').then(m => m.Report4RoutingModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedReportsRoutingModule { }
