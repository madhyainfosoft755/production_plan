import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MachineMastersRoutingModule } from './machine-masters-routing.module';
import { MachineMastersComponent } from './machine-masters.component';

import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AddMachineMasterComponent } from './add-machine-master/add-machine-master.component';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SidebarModule } from 'primeng/sidebar';
import { PaginatorModule } from 'primeng/paginator';
import { AddModuleComponent } from 'src/app/shared/components/add-module/add-module.component';


@NgModule({
  declarations: [
    MachineMastersComponent,
    AddMachineMasterComponent
  ],
  imports: [
    CommonModule,
    MachineMastersRoutingModule,
    ReactiveFormsModule,
    TableModule,
    BreadcrumbModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    ProgressSpinnerModule,
    AddModuleComponent,
    SidebarModule,
    PaginatorModule
  ]
})
export class MachineMastersModule { }
