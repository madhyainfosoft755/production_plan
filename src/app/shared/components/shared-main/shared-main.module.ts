import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MainRoutingModule } from './shared-main-routing.module';
import { ThisMonthComponent, SortIconsComponent } from './this-month/this-month.component';
import { HistoryComponent } from './history/history.component';
import { UpdateMainFileComponent } from './this-month/update-main-file/update-main-file.component';

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
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';
import { PaginatorModule } from 'primeng/paginator';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DailyUpdateComponent } from '../daily-update/daily-update.component';
import { AddWeeklyPlanningComponent } from '../add-weekly-planning/add-weekly-planning.component';


@NgModule({
  declarations: [
    ThisMonthComponent,
    HistoryComponent,
    UpdateMainFileComponent,
    SortIconsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MainRoutingModule,
    BreadcrumbModule,
    TableModule,
    ButtonModule,
    ReactiveFormsModule,
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
    PaginatorModule,
    DailyUpdateComponent,
    AddWeeklyPlanningComponent,
    OverlayPanelModule,
    AutoCompleteModule,
    CheckboxModule
  ],
  exports: [
    ThisMonthComponent,
    HistoryComponent,
    UpdateMainFileComponent,
    DailyUpdateComponent,
    AddWeeklyPlanningComponent,
    SortIconsComponent
  ]
})
export class SharedMainModule { }
