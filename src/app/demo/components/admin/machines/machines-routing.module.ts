import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MachinesComponent } from './machines.component';
import { UpdateMachineComponent } from './update-machine/update-machine.component';

const routes: Routes = [
  {
    path: '',
    component: MachinesComponent,
    data: { title: 'Machines' }
  },
  { 
    path: 'machine-details/:id', 
    component: UpdateMachineComponent ,
    data: { title: 'Edit Machine' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachinesRoutingModule { }
