import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyUpdateRoutingModule } from './daily-update-routing.module';
import { DailyUpdateComponent } from 'src/app/shared/components/daily-update/daily-update.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DailyUpdateRoutingModule,
    DailyUpdateComponent
  ]
})
export class DailyUpdateModule { }
