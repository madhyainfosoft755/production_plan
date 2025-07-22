import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { ThisMonthComponent } from './this-month/this-month.component';
import { HistoryComponent } from './history/history.component';
import { SharedMainModule } from 'src/app/shared/components/shared-main/shared-main.module';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import {TableModule} from 'primeng/table';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    ThisMonthComponent,
    HistoryComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    BreadcrumbModule,
    TableModule,
    ButtonModule,
    SharedMainModule
  ]
})
export class MainModule { }
