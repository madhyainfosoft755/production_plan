import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MachinesComponent } from './machines.component';

const routes: Routes = [
  {
    path: '',
    component: MachinesComponent,
    data: { title: 'Machines' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachinesRoutingModule { }
