import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThisMonthComponent } from './this-month.component';

const routes: Routes = [
  { path: '', component: ThisMonthComponent, data: { title: 'Main File' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThisMonthRoutingModule { }
