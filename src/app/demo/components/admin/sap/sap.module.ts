import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { SapRoutingModule } from './sap-routing.module';
import { UploadComponent } from './upload/upload.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UploadComponent
  ],
  imports: [
    CommonModule,
    SapRoutingModule,
    FormsModule,
    ButtonModule,
    BreadcrumbModule,
    MessagesModule,
    ProgressSpinnerModule
  ]
})
export class SapModule { }
