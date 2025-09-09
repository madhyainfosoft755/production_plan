import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantMachineBookingComponent } from './plant-machine-booking.component';

const routes: Routes = [
  { path: '', component: PlantMachineBookingComponent, data: { title: 'Plant Machine Booking' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantMachineBookingRoutingModule { }
