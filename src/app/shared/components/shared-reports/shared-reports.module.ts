import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedReportsRoutingModule } from './shared-reports-routing.module';
import { Report2Component } from './report2/report2.component';
import { Report3Component } from './report3/report3.component';
import { Report4Component } from './report4/report4.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';


@NgModule({
  declarations: [
    Report2Component,
    Report3Component,
    Report4Component
  ],
  imports: [
    CommonModule,
    SharedReportsRoutingModule,
    TableModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    DialogModule,
    DropdownModule,
    FieldsetModule,
    InputGroupModule,
    InputGroupAddonModule,
    ProgressSpinnerModule,
    CalendarModule,
    MultiSelectModule,
    TabViewModule,
    BreadcrumbModule
  ]
})
export class SharedReportsModule { }
