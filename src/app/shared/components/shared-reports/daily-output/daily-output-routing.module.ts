import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyOutputComponent } from './daily-output.component';

const routes: Routes = [
  { path: '', component: DailyOutputComponent, data: { title: 'Report | Daily Output' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyOutputRoutingModule { }
