import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThisMonthRoutingModule } from './this-month-routing.module';
// import { UpdateMainFileComponent } from './update-main-file/update-main-file.component';


@NgModule({
  declarations: [
    // UpdateMainFileComponent
  ],
  imports: [
    CommonModule,
    ThisMonthRoutingModule,
  ]
})
export class SharedThisMonthModule { }
