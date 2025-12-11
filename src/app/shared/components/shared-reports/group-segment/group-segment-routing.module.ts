import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupSegmentComponent } from './group-segment.component';

const routes: Routes = [
  { path: '', component: GroupSegmentComponent, data: { title: 'Report | Group Segment' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupSegmentRoutingModule { }
