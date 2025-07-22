import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabViewModule } from 'primeng/tabview';
import { BreadcrumbModule } from 'primeng/breadcrumb';

import { OthersRoutingModule } from './others-routing.module';
import { HomeComponent } from './home/home.component';
import { PlantComponent } from './plant/plant.component';
import { FinishComponent } from './finish/finish.component';
import { GroupsComponent } from './groups/groups.component';
import { MachineModulesComponent } from './machine-modules/machine-modules.component';
import { MaterialInfoComponent } from './material-info/material-info.component';
import { ModulesComponent } from './modules/modules.component';
import { ProcessComponent } from './process/process.component';
import { RolesComponent } from './roles/roles.component';
import { Seg2Component } from './seg2/seg2.component';
import { Seg3Component } from './seg3/seg3.component';
import { SegmentsComponent } from './segments/segments.component';
import { UnitOfMeasureComponent } from './unit-of-measure/unit-of-measure.component';
import { AddFinishComponent } from 'src/app/shared/components/add-finish/add-finish.component';
import { AddSTPComponent } from 'src/app/shared/components/add-stp/add-stp.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AddSeg3Component } from 'src/app/shared/components/add-seg-3/add-seg-3.component';
import { AddSegmentsComponent } from 'src/app/shared/components/add-segments/add-segments.component';
import { AddModuleComponent } from 'src/app/shared/components/add-module/add-module.component';
import { AddGroupComponent } from 'src/app/shared/components/add-group/add-group.component';
import { AddSeg2Component } from 'src/app/shared/components/add-seg-2/add-seg-2.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { SurfaceTreatmentComponent } from './surface-treatment/surface-treatment.component';
import { MasterTemplatePasswordsComponent } from './master-templates-password/master-templates-password.component';


@NgModule({
  declarations: [
    HomeComponent,
    PlantComponent,
    FinishComponent,
    GroupsComponent,
    MachineModulesComponent,
    MaterialInfoComponent,
    ModulesComponent,
    PlantComponent,
    ProcessComponent,
    RolesComponent,
    Seg2Component,
    Seg3Component,
    SegmentsComponent,
    UnitOfMeasureComponent,
    ShiftsComponent,
    SurfaceTreatmentComponent,
    MasterTemplatePasswordsComponent
  ],
  imports: [
    CommonModule,
    OthersRoutingModule,
    TabViewModule,
    TableModule,
    ButtonModule,
    DialogModule,
    AddFinishComponent,
    AddSeg3Component,
    AddSeg2Component,
    AddSegmentsComponent,
    AddModuleComponent,
    AddGroupComponent,
    AddSTPComponent,
    BreadcrumbModule
  ]
})
export class OthersModule { }
