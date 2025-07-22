import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PlantComponent } from './plant/plant.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Others' }
    // children: [
    //   { path: '', component: PlantComponent },
    // ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OthersRoutingModule { }
