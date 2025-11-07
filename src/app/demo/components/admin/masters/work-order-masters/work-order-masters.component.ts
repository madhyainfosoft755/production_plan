import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { PageEvent } from 'src/app/models/common-models';
import { MessageService } from 'primeng/api';

import { AdminApiService } from 'src/app/services/adminapi.service';
import { CommonUtilsService } from 'src/app/services/common-utils.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-work-order-masters',
  templateUrl: './work-order-masters.component.html',
  styleUrl: './work-order-masters.component.scss',
  providers: [MessageService]
})
export class WorkOrderMastersComponent implements OnInit, OnDestroy {

  workOrderMaster!: {id: number, plant: string, work_order_db: string, customer: string, quality_inspection_required: boolean}[];
  loadingWOMD: boolean = false;
  loadingAdvanceFilter = false;
  loadingDWOMTemplate = false;
  breadcrumbItems: any[];
  visibleAddWOMasterDialog: boolean = false;
  subscriptions: Subscription[] = [];
  enableAdvSearch = false;
  initialAdvSearchValues;
  loadingExport = false;
  rangeDates: Date[] | undefined = (() => {
    const start = new Date();                               // today
    const end   = new Date(start.getTime() + 45 * 86400000); // 45 days later
    return [start, end];
  })();
  dateTypes = [
    { label: 'All', value: 'all' },
    { label: 'Receiving Date', value: 'reciving_date' },
    { label: 'Delivery Date', value: 'delivery_date' },
    { label: 'WO Adding Date', value: 'wo_add_date' }
  ];
  dateType: string;
  visibleFilterDrawer = false;
  workOrderFilterForm!: FormGroup;
  loadingWOMFileStatus = false;
  loadingWOMFailedRecords = false;
  loadingValidateWOMFile = false;
  segments: any[] = [];
  pagination: {
    current_page: string,
    per_page: string,
    total: string,
    last_page: string
  };
  workOrderMasterFileStatus: any = null;
  visibleAddPartsDialog = false;
  selectedWO: any = null;


  constructor(
    private adminApiService: AdminApiService,
    private fb: FormBuilder,
    private commonUtilsService: CommonUtilsService,
    private router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private excelService: ExcelService
  ){
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'Work Order Master' }
    ];
    this.dateType = this.dateTypes[0].value; // Default to the first date type
    this.rangeDates = [null, null]; // Initialize rangeDates to nulls
    this.workOrderFilterForm = this.fb.group({
      work_order_db: ['', [Validators.maxLength(6)]],
      customer: ['', [Validators.maxLength(255)]],
      responsible_person_name: ['', [Validators.maxLength(255)]],
      segment_id: ['', Validators.required],
      marketing_person_name: ['', [Validators.maxLength(255)]],
    });
    this.initialAdvSearchValues = this.workOrderFilterForm.value;
  }

  ngOnInit(): void {
    const advanceSearchFormSub = this.workOrderFilterForm.valueChanges.subscribe(currentValue  => {
      this.enableAdvSearch = JSON.stringify(this.commonUtilsService.replaceNullsWithEmpty(currentValue)) !== JSON.stringify(this.commonUtilsService.replaceNullsWithEmpty(this.initialAdvSearchValues));
    });
    this.subscriptions.push(advanceSearchFormSub);
    this.loadData();
    this.loadSegments();
    this.loadWorkOrderFileUploadStatus();
  }
  loadWorkOrderFileUploadStatus(){
    this.loadingWOMFileStatus = true;
    this.adminApiService.getWorkOrderFileUploadStatus().subscribe({
      next: (res: any)=>{
        this.workOrderMasterFileStatus = res.data ?? {status: 'completed', total_failed_records: 0};
        this.loadingWOMFileStatus = false;
      }, 
      error: (err: any)=>{
        this.loadingWOMFileStatus = false;
      }
    });
  }

  onDateTypeChange(event: any){
    if(event && event.value === 'all'){
      this.rangeDates = [null, null];
    } else {
      const start = new Date();                               // today
      const end   = new Date(start.getTime() + 45 * 86400000); // 45 days later
      this.rangeDates = [start, end];
    }
  }

  loadWOMFailedRecords(){
    this.loadingWOMFailedRecords = true;
    this.adminApiService.getWorkOrderFailedRecords().subscribe({
      next: (response)=>{
        const blob = response.body!;
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'FailedWorkOrderMasterRecords.xlsx'; // default fallback
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

        this.loadWorkOrderFileUploadStatus();
        this.loadingWOMFailedRecords = false;
      }, 
      error: (err: any)=>{
        this.loadingWOMFailedRecords = false;
      }
    });
  }

  validateWOMFile(){
    this.loadingValidateWOMFile = true;
    this.adminApiService.validateWOMFile().subscribe({
      next: (res: any)=>{
        if(res.status === "failed"){
          this.messageService.add({ severity: 'warn', summary: 'Information', detail: 'No Record Found' });
        }
        this.loadWorkOrderFileUploadStatus();
        this.loadData();
        this.loadingValidateWOMFile = false;
      }, 
      error: (err: any)=>{
        this.loadingValidateWOMFile = false;
      }
    });
  }

  loadSegments(){
    this.adminApiService.get_all_segments().subscribe({
      next: (res: any)=>{
        this.segments = res.data;
      }, 
      error: (err: any)=>{
      }
    });
  }

  loadData(page=1, exportData=false){
    if(exportData){
      this.loadingExport = true;
    } else {
      this.loadingWOMD = true;
    }
    if(this.enableAdvSearch){
      this.loadingAdvanceFilter = true;
    }
    let rangeDates: any;
    if(this.rangeDates && this.rangeDates[0] && this.rangeDates[1]){
      rangeDates = this.rangeDates ? this.rangeDates.map(date => this.datePipe.transform(date, 'dd-MM-yyyy')) : undefined;
    } else {
      rangeDates= null;
    }
    let filterVal = {...this.workOrderFilterForm.value, 'range_dates': rangeDates, 'date_type': this.dateType}
    if(exportData){
      filterVal = {...filterVal, export: 'true'};
    }
    this.adminApiService.get_work_order_master(filterVal, page).subscribe({
      next: (res: any)=>{
        if(exportData){
          const fileDate = this.datePipe.transform(new Date(), 'dd_MM_yyyy');

          const exportData = this.workOrderMaster.map((r: any, i: number) => ({
            'SN': i+1,
            'Plant': r.plant ,
            'Work Order': r.work_order_db.toUpperCase() ,
            'Customer': r.customer ,
            'Responsible Person': r.responsible_person_name ? r.responsible_person_name  : r.responsible_person_name1,
            'Segment': r.segment_name ,
            'Marketing Person': r.marketing_person_name ? r.marketing_person_name : r.marketing_person_name1,
            'Receiving Date': this.datePipe.transform(r.reciving_date, 'dd-MM-yyyy'),
            'Delivery Dat': this.datePipe.transform(r.delivery_date, 'dd-MM-yyyy'),
            'QIR': r.quality_inspection_required_status==="1"? 'Yes':'No' ,
            'WO Add Date': this.datePipe.transform(r.wo_add_date, 'dd-MM-yyyy'),
            'No. Of Items': r.no_of_items ,
            'Weight': r.weight
          }));

          this.excelService.exportToExcel(exportData, `Work_Order_Master_Data_${fileDate}`);
          this.loadingWOMD = false;
          this.loadingExport = false;
        } else {
          this.workOrderMaster = res.data.map(value=>({...value, quality_inspection_required_status: value.quality_inspection_required==="1" ? "new" : "unqualified"}));
          this.pagination = res.pagination;
          if(this.enableAdvSearch){
            this.visibleFilterDrawer = false;
          }
          this.loadingWOMD = false;
          this.loadingExport = false;
          this.loadingAdvanceFilter = false;
        }
      }, 
      error: (err: any)=>{
        this.loadingWOMD = false;
        this.loadingExport = false;
        this.loadingAdvanceFilter = false;
      }
    });
  }

  showAddWOMasterDialog(){
    this.selectedWO = null;
    this.visibleAddWOMasterDialog = true;
  }

  editWOMasterDialog(wo: any){
    this.selectedWO = wo;
    this.visibleAddWOMasterDialog = true;
  }

  onChildNotify(message: boolean): void {
    if(message){
      this.loadData();
      this.visibleAddWOMasterDialog = false; // Close the dialog or perform any action
    }
  }

  onPartsChildNotify(message: boolean): void {
    if(message){
      this.loadData();
      this.visibleAddPartsDialog = false; // Close the dialog or perform any action
    }
  }

  downloadWOMTemplate(){
    this.loadingDWOMTemplate = true;
    this.adminApiService.download_wom_template().subscribe({
      next: (response)=>{
        const blob = response.body!;
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'WorkOrderMasterTemplate.xlsx'; // default fallback
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
        this.loadingDWOMTemplate = false;
      }, 
      error: (err: any)=>{
        this.loadingDWOMTemplate = false;
      }
    });
  }

  uploadWOMFile(){
    this.router.navigate(['/admin/masters/work-order-master/upload-wom']);  
  }

  showFilterDrawer(){
    this.visibleFilterDrawer = true;
  }

  onSubmitFilter(){
    this.loadData();
  }

  capitalizeInput(controlName: string) {
    const value = this.workOrderFilterForm.get(controlName)?.value;
    if (value) {
      this.workOrderFilterForm.get(controlName)?.setValue(value.toUpperCase(), { emitEvent: false });
    }
  }


  onPageChange(event: PageEvent) {
    this.loadData(Number(event.page)+1);
  }

  clearAdvanceFilter(){
    this.workOrderFilterForm.reset();
    this.loadData();
  }

  shoeAddPartDialog(){
    this.visibleAddPartsDialog = true
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  exportExcel() {
    this.loadData(1, true);
  }

}
