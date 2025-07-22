import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SidebarModule } from 'primeng/sidebar';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { InputGroupModule } from 'primeng/inputgroup';


import { WorkOrderMastersRoutingModule } from './work-order-masters-routing.module';
import { WorkOrderMastersComponent } from './work-order-masters.component';
import { AddWorkOrderComponent } from './add-work-order/add-work-order.component';
import { UploadWOMComponent } from './upload-wom/upload-wom.component';
import { AddPartNumberComponent } from './add-part-number/add-part-number.component';

@NgModule({
  declarations: [
    WorkOrderMastersComponent,
    AddWorkOrderComponent,
    UploadWOMComponent,
    AddPartNumberComponent
  ],
  imports: [
    CommonModule,
    WorkOrderMastersRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    BreadcrumbModule,
    DialogModule,
    ButtonModule,
    InputSwitchModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    ProgressSpinnerModule,
    AutoCompleteModule,
    SidebarModule,
    PaginatorModule,
    ToastModule,
    MessagesModule,
    InputGroupModule
  ]
})
export class WorkOrderMastersModule { }
