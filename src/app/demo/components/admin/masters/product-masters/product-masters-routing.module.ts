import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductMastersComponent } from './product-masters.component';
import { UploadPMComponent } from './upload-pm/upload-pm.component';

const routes: Routes = [
  { path: '', component: ProductMastersComponent, data: { title: 'Product Master' } },
  { path: 'upload-pm', component: UploadPMComponent, data: { title: 'Upload Product Master' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductMastersRoutingModule { }
