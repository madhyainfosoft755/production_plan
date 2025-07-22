import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MastersRoutingModule } from './masters-routing.module';

import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MastersRoutingModule,
    TableModule,
    BreadcrumbModule,
    ProgressSpinnerModule
  ]
})
export class MastersModule { }
