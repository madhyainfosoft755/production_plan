import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupTargetComponent } from './group-target.component';

const routes: Routes = [
  { path: '', component: GroupTargetComponent, data: { title: 'Report | Main File History' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupTargetRoutingModule { }
