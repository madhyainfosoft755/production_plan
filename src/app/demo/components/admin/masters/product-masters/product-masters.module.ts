import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

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
import { SidebarModule } from 'primeng/sidebar';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';

import { ProductMastersRoutingModule } from './product-masters-routing.module';
import { AddProductMasterComponent } from './add-product-master/add-product-master.component';
import { ProductMastersComponent } from './product-masters.component';
import { FilterProductMasterComponent } from './filter-product-master/filter-product-master.component';
import { AddFinishComponent } from 'src/app/shared/components/add-finish/add-finish.component';
import { AddSeg2Component } from 'src/app/shared/components/add-seg-2/add-seg-2.component';
import { AddSeg3Component } from 'src/app/shared/components/add-seg-3/add-seg-3.component';
import { AddSegmentsComponent } from 'src/app/shared/components/add-segments/add-segments.component';
import { AddGroupComponent } from 'src/app/shared/components/add-group/add-group.component';

import { AgGridModule, AgGridAngular } from 'ag-grid-angular';
import { UploadPMComponent } from './upload-pm/upload-pm.component';
// import { ClientSideRowModelApiModule } from 'ag-grid-community';



@NgModule({
  declarations: [
    ProductMastersComponent,
    AddProductMasterComponent,
    FilterProductMasterComponent,
    UploadPMComponent
  ],
  imports: [
    CommonModule,
    ProductMastersRoutingModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DialogModule,
    DropdownModule,
    FieldsetModule,
    InputGroupModule,
    InputGroupAddonModule,
    AddFinishComponent,
    BreadcrumbModule,
    ProgressSpinnerModule,
    AddSeg2Component,
    AddSeg3Component,
    AddSegmentsComponent,
    AddGroupComponent,
    AgGridModule,
    AgGridAngular,
    SidebarModule,
    PaginatorModule,
    ToastModule,
    MessagesModule
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Only add this if you are using web components
})
export class ProductMastersModule { }
