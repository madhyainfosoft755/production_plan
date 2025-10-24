import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonUtilsService } from 'src/app/services/common-utils.service';
import { PageEvent } from 'src/app/models/common-models';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
// import { PivotModule } from 'ag-grid-enterprise';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-product-masters',
  templateUrl: './product-masters.component.html',
  styleUrl: './product-masters.component.scss',
  providers: [MessageService]
})
export class ProductMastersComponent implements OnInit, OnDestroy {
  productMasterData!: any;
  loadingPMD: boolean = false;
  visibleAddPMDialog: boolean = false;
  breadcrumbItems: any[];
  pivotMode = true;
  columnDefs: ColDef[] = [
    { headerName: 'Order', field: 'order_number', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Material Number', field: 'material_number', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Material Number with Process', field: 'material_number_for_process', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Material description', field: 'material_description', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Unit of measure (=GMEIN)', field: 'unit_of_measure', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Machine Name', field: 'machine_name', filter: true , pivot: true, enablePivot: true },
    // { headerName: 'Machine-1', field: 'machine_1', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Responsible ', field: 'responsible_name', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Module', field: 'module_name', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Segment', field: 'segment_name', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Cheese Wt', field: 'cheese_wt', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Finish ', field: 'finish_name', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Finish Wt.', field: 'finish_wt', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Size', field: 'size', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Group', field: 'group_name', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Length', field: 'length', filter: true , pivot: true, enablePivot: true },
    { headerName: 'SPEC', field: 'spec', filter: true , pivot: true, enablePivot: true },
    { headerName: 'ROD DIA1.', field: 'rod_dia1', filter: true , pivot: true, enablePivot: true },
    { headerName: 'DRAWN DIA.1', field: 'drawn_dia1', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Condition of Raw material ', field: 'condition_of_rm', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Seg-2', field: 'seg2_name', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Seg-3', field: 'seg3_name', filter: true , pivot: true, enablePivot: true },
    { headerName: 'SPECIAL REMARKS', field: 'special_remarks', filter: true , pivot: true, enablePivot: true },
    { headerName: 'BOM ', field: 'bom', filter: true , pivot: true, enablePivot: true },
    { headerName: 'RM Component', field: 'rm_component', filter: true , pivot: true, enablePivot: true },
    { headerName: 'Added At', field: 'created_at', filter: true , pivot: true, enablePivot: true },
  ];
  initialAdvSearchValues: any;
  loadingAdvanceFilter = false;
  loadingDPMTemplate = false;
  subscriptions: Subscription[] = [];
  enableAdvSearch = false;
  loadingPMFailedRecords = false;
  loadingValidatePMFile = false;
  loadingPMFileStatus = false;
  productMasterFileStatus: any = null;
  selectedPMD: any = null;

  visibleFilterDrawer = false;
  segments: any[] = [];
  pagination: {
    current_page: string,
    per_page: string,
    total: string,
    last_page: string
  };
  productMasterForm: FormGroup;
  constructor(
    private adminApiService: AdminApiService,
    private fb: FormBuilder,
    private commonUtilsService: CommonUtilsService,
    private router: Router,
    private messageService: MessageService
  ){ 
    this.productMasterForm = this.fb.group({
      order_number: [''],
      material_number: [''],
      machine: [''],
      machine_module: [''],
      segment: [null],
      cheese_wt: [null],
      finish: [null],
      finish_wt: [null],
      size: [null],
      length: [null],
      spec: [null],
      rod_dia1: [null],
      drawn_dia1: [null],
      prod_group: [null],
      seg2: [null],
      seg3: [null],
      special_remarks: [null],
      bom: [null],
      rm_component: [null],
    });
    this.initialAdvSearchValues = this.productMasterForm.value;
  }
  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'Product Master' }
    ];
    const advanceSearchFormSub = this.productMasterForm.valueChanges.subscribe(currentValue  => {
      this.enableAdvSearch = JSON.stringify(this.commonUtilsService.replaceNullsWithEmpty(currentValue)) !== JSON.stringify(this.commonUtilsService.replaceNullsWithEmpty(this.initialAdvSearchValues));
    });
    this.load_machines();
    this.loadPMFileUploadStatus();
  }

  loadPMFileUploadStatus(){
    this.loadingPMFileStatus = true;
    this.adminApiService.getPMFileUploadStatus().subscribe({
      next: (res: any)=>{
        this.productMasterFileStatus = res.data ?? {status: 'completed', total_failed_records: 0};
        this.loadingPMFileStatus = false;
      }, 
      error: (err: any)=>{
        this.loadingPMFileStatus = false;
      }
    });
  }

  loadPMFailedRecords(){
    this.loadingPMFailedRecords = true;
    this.adminApiService.getPMFailedRecords().subscribe({
      next: (response)=>{

        const blob = response.body!;
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'FailedProductMasterRecords.xlsx'; // default fallback
        if (contentDisposition) {
          const matches = /filename="([^"]+)"/.exec(contentDisposition);
          if (matches?.[1]) {
            filename = matches[1];
          }
        }

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();

        URL.revokeObjectURL(a.href); // clean up

        this.loadPMFileUploadStatus();
        this.loadingPMFailedRecords = false;
      }, 
      error: (err: any)=>{
        this.loadingPMFailedRecords = false;
      }
    });
  }

  validatePMFile(){
    this.loadingValidatePMFile = true;
    this.adminApiService.validatePMFile().subscribe({
      next: (res: any)=>{
        if(res.status === "failed"){
          this.messageService.add({ severity: 'warn', summary: 'Information', detail: 'No Record Found' });
        }
        this.loadPMFileUploadStatus();
        this.load_machines();
        this.loadingValidatePMFile = false;
      }, 
      error: (err: any)=>{
        this.loadingValidatePMFile = false;
      }
    });
  }

  load_machines(page=1){
    this.loadingPMD = true;
    if(this.enableAdvSearch){
      this.loadingAdvanceFilter = true;
    }
    this.adminApiService.get_all_product_master(this.productMasterForm.value, page).subscribe({
      next: (res: any)=>{

        // Measure the size of the incoming data
        const dataSize = new TextEncoder().encode(JSON.stringify(res)).length;

        // Log the size of the incoming data in bytes

        const dataSizeInMB = dataSize / (1024 * 1024); // Convert bytes to MB


        this.productMasterData = res.data;
        this.pagination = res.pagination;
        if(this.enableAdvSearch){
          this.visibleFilterDrawer = false;
        }
        this.loadingPMD = false;
        this.loadingAdvanceFilter = false;
      }, 
      error: (err: any)=>{
        this.loadingPMD = false;
        this.loadingAdvanceFilter = false;

      }
    });
  }

  onHideAdvanceFilter(){
    this.visibleFilterDrawer = false;
  }

  showAddPMDialog(){
    this.selectedPMD = null;
    this.visibleAddPMDialog = true;
  }

  editPMasterDialog(pmd: any){
    this.selectedPMD = pmd;
    this.visibleAddPMDialog = true;
  }

  onFormDataChange(updatedForm: FormGroup) {
    this.productMasterForm = updatedForm;
  }
  onClearAdvanceFilter(){
    this.load_machines(); // Reload machines with updated form data
  }

  onChildNotify(message: boolean): void {
    if(message){
      this.load_machines();
      this.visibleAddPMDialog = false; // Close the dialog or perform any action
    }
  }

  onFilterNotify(message: boolean): void {
    if(message){
      this.load_machines();
      // this.visibleAddPMDialog = false; // Close the dialog or perform any action
    }
  }


  downloadPMTemplate(){
    this.loadingDPMTemplate = true;
    this.adminApiService.download_pm_template().subscribe({
      next: (response)=>{
        const blob = response.body!;
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'ProductMasterTemplate.xlsx'; // default fallback
        if (contentDisposition) {
          const matches = /filename="([^"]+)"/.exec(contentDisposition);
          if (matches?.[1]) {
            filename = matches[1];
          }
        }

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();

        URL.revokeObjectURL(a.href); // clean up
        this.loadingDPMTemplate = false;
      }, 
      error: (err: any)=>{
        this.loadingDPMTemplate = false;
      }
    });
  }

  uploadPMFile(){
    this.router.navigate(['/admin/masters/product-master/upload-pm']);
  }

  showFilterDrawer(){
    this.visibleFilterDrawer = true;
  }

  onSubmitFilter(){
    this.load_machines();
  }

  onPageChange(event: PageEvent) {
    this.load_machines(Number(event.page)+1);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
