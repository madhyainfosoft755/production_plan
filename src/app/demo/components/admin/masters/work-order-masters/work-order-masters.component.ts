import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageEvent } from 'src/app/models/common-models';
import { MessageService } from 'primeng/api';

import { AdminApiService } from 'src/app/services/adminapi.service';
import { CommonUtilsService } from 'src/app/services/common-utils.service';

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
  rangeDates: Date[] | undefined = (() => {
    const start = new Date();                               // today
    const end   = new Date(start.getTime() + 45 * 86400000); // 45 days later
    return [start, end];
  })();
  dateTypes = [
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


  constructor(
    private adminApiService: AdminApiService,
    private fb: FormBuilder,
    private commonUtilsService: CommonUtilsService,
    private router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService
  ){
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'Work Order Master' }
    ];
    this.dateType = this.dateTypes[1].value; // Default to the first date type
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
        this.workOrderMasterFileStatus = res.data;
        this.loadingWOMFileStatus = false;
      }, 
      error: (err: any)=>{
        console.log(err);
        this.loadingWOMFileStatus = false;
      }
    });
  }

  loadWOMFailedRecords(){
    this.loadingWOMFailedRecords = true;
    this.adminApiService.getWorkOrderFailedRecords().subscribe({
      next: (res: Blob)=>{
        // if(res?.status === "failed"){
        //   this.messageService.add({ severity: 'warn', summary: 'Information', detail: 'No Record Found' });
        // } else {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(res);
          a.download = 'FailedWorkOrderMasterRecords.xlsx';
          a.click();
        // }

        this.loadWorkOrderFileUploadStatus();
        this.loadingWOMFailedRecords = false;
      }, 
      error: (err: any)=>{
        console.log(err);
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
        console.log(err);
        this.loadingValidateWOMFile = false;
      }
    });
  }

  loadSegments(){
    this.adminApiService.get_all_segments().subscribe({
      next: (res: any)=>{
        this.segments = res.data;
        console.log(this.segments)
      }, 
      error: (err: any)=>{
        console.log(err);
      }
    });
  }

  loadData(page=1){
    this.loadingWOMD = true;
    if(this.enableAdvSearch){
      this.loadingAdvanceFilter = true;
    }
    const rangeDates = this.rangeDates ? this.rangeDates.map(date => this.datePipe.transform(date, 'dd-MM-yyyy')) : undefined;
    this.adminApiService.get_work_order_master({...this.workOrderFilterForm.value, 'range_dates': rangeDates, 'date_type': this.dateType}, page).subscribe({
      next: (res: any)=>{
        this.workOrderMaster = res.data.map(value=>({...value, quality_inspection_required_status: value.quality_inspection_required==="1" ? "new" : "unqualified"}));
        this.pagination = res.pagination;
        if(this.enableAdvSearch){
          this.visibleFilterDrawer = false;
        }
        this.loadingWOMD = false;
        this.loadingAdvanceFilter = false;
      }, 
      error: (err: any)=>{
        console.log(err);
        this.loadingWOMD = false;
        this.loadingAdvanceFilter = false;
      }
    });
  }

  showAddWOMasterDialog(){
    this.visibleAddWOMasterDialog = true;
  }

  onChildNotify(message: boolean): void {
    console.log('Notification from child:', message);
    if(message){
      this.loadData();
      this.visibleAddWOMasterDialog = false; // Close the dialog or perform any action
    }
  }

  onPartsChildNotify(message: boolean): void {
    console.log('Notification from child:', message);
    if(message){
      this.loadData();
      this.visibleAddPartsDialog = false; // Close the dialog or perform any action
    }
  }

  downloadWOMTemplate(){
    this.loadingDWOMTemplate = true;
    this.adminApiService.download_wom_template().subscribe({
      next: (blob: Blob)=>{
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'WorkOrderMasterTemplate.xlsx';
        a.click();
        this.loadingDWOMTemplate = false;
      }, 
      error: (err: any)=>{
        console.log(err);
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
    console.log(event)
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

}
