import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./work-order-masters/work-order-masters.module').then(m => m.WorkOrderMastersModule)
  },
  {
    path: 'product-master',
    loadChildren: () => import('./product-masters/product-masters.module').then(m => m.ProductMastersModule)
  },
  {
    path: 'machine-master',
    loadChildren: () => import('./machine-masters/machine-masters.module').then(m => m.MachineMastersModule)
  },
  {
    path: 'work-order-master',
    loadChildren: () => import('./work-order-masters/work-order-masters.module').then(m => m.WorkOrderMastersModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
