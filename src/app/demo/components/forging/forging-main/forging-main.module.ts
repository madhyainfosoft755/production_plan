import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './forging-main-routing.module';
import { ThisMonthComponent } from './this-month/this-month.component';
import { HistoryComponent } from './history/history.component';
import { SharedMainModule } from 'src/app/shared/components/shared-main/shared-main.module';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import {TableModule} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DailyUpdateComponent } from './daily-update/daily-update.component';


@NgModule({
  declarations: [
    ThisMonthComponent,
    HistoryComponent,
    DailyUpdateComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    BreadcrumbModule,
    TableModule,
    ButtonModule,
    SharedMainModule,

  ]
})
export class ForgingMainModule { }
