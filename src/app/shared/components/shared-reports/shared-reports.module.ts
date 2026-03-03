import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedReportsRoutingModule } from './shared-reports-routing.module';
import { GroupSegmentComponent } from './group-segment/group-segment.component';
import { GroupTargetComponent } from './group-target/group-target.component';
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
import { PlantMachineBookingComponent } from './plant-machine-booking/plant-machine-booking.component';
import { DailyOutputComponent } from './daily-output/daily-output.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { FinishWisePlanningComponent } from './finish-wise-planning/finish-wise-planning.component';


@NgModule({
  declarations: [
    GroupSegmentComponent,
    GroupTargetComponent,
    GroupDetailsComponent,
    Report4Component,
    PlantMachineBookingComponent,
    DailyOutputComponent,
    FinishWisePlanningComponent
  ],
  imports: [
    CommonModule,
    SharedReportsRoutingModule,
    DatePipe,
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
