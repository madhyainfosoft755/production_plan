import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MultiSelectModule } from 'primeng/multiselect';


import { MachinesRoutingModule } from './machines-routing.module';
import { MachinesComponent } from './machines.component';
import { MachineDetailsComponent } from './machine-details/machine-details.component';


@NgModule({
  declarations: [
    MachinesComponent,
    MachineDetailsComponent
  ],
  imports: [
    CommonModule,
    MachinesRoutingModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DialogModule,
    DropdownModule,
    InputNumberModule,
    BreadcrumbModule,
    MultiSelectModule
  ]
})
export class MachinesModule { }
