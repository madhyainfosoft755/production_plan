import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkOrderMastersComponent } from './work-order-masters.component';
import { UploadWOMComponent } from './upload-wom/upload-wom.component';

const routes: Routes = [
  { path: '', component: WorkOrderMastersComponent, data: { title: 'Work Order Master' } },
  { path: 'upload-wom', component: UploadWOMComponent, data: { title: 'Upload Work Order Master' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkOrderMastersRoutingModule { }
