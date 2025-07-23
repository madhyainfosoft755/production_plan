import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { UnbrakoPPCommonService } from 'src/app/services/unbrako-pp-common';
import { ExcelService } from 'src/app/services/excel.service';
import { PageEvent } from 'src/app/models/common-models';
import { OverlayPanel } from 'primeng/overlaypanel';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}


import { Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
  selector: 'app-sort-icons',
  template: `
      <i
      class="pi pi-sort-alt"
      *ngIf="!sortBy"
      (click)="handleClick(1)"
    ></i> <span (click)="handleClick(-1)">{{sortBy?.field}}</span> 

    <i
      class="pi pi-sort-amount-up-alt"
      style="color: blue;"
      *ngIf="(sortBy && sortBy.field == colField && sortBy.value === 1)"
      (click)="handleClick(-1)"
    ></i>

    <i
      class="pi pi-sort-amount-down"
      style="color: blue;"
      *ngIf="(sortBy && sortBy.field == colField && sortBy.value === -1)"
      (click)="handleClick(1)"
    ></i>
  `,
})
export class SortIconsComponent {
  @Input() colField: string;
  @Input() sortBy: any;

  @Output() sortClick = new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef) {}


  handleClick(val: number) {
    // Manually trigger change detection
    this.cdr.detectChanges();
    this.sortBy = {field: this.colField , value:val};
    this.sortClick.emit(this.sortBy);
  }
}



@Component({
  selector: 'app-shared-this-month',
  templateUrl: './this-month.component.html',
  styleUrl: './this-month.component.scss'
})
export class ThisMonthComponent implements OnInit {
  breadcrumbItems: any[];
  data: any;
  loading_data: boolean = false;
  visibleMainFileDialog: boolean = false;
  visibleAdminUpdateDialog = false;
  STPData: any[] = [];
  selectedRow: any = null;
  cols: Column[];
  _selectedColumns: Column[];
  selectedFilters: string[] = [];
  exportColumns!: ExportColumn[];
  pagination: {
    current_page: string,
    per_page: string,
    total: string,
    last_page: string
  };
  filter: any = null;
  loadingSAPFilters = false;
  loadingSurfaceTreatment = false;
  sapFilters: any;
  sortBy: {field: string, value: number}|null = null;
  filterForObj: any;
  filterForArray: any;
  currentFilterField = null;
  currentPanelId = null;
  page: number = 1;
  selectedRecords: any[] = [];
  @ViewChildren('op') overlayPanels: QueryList<OverlayPanel>;
  today = new Date();
  isAdminUser : boolean | null = null;
  sapRmData: any[] = [];
  isRmUser : boolean | null = null;
  
  constructor(
    private adminApiService: AdminApiService,
    private unbrakoPPCommonService: UnbrakoPPCommonService,
    private excelService: ExcelService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private constantService: ConstantService
  ){}

  ngOnInit() :void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'This Month File' }
    ];
    // this.cols = [
    //     { field: 'orderNumber', header: 'Order'},
    //     { field: 'plant', header: 'Plant'},
    //     { field: 'materialNumber', header: 'Material Number'},
    //     { field: 'materialDescription', header: 'Material description'},
    //     { field: 'orderQuantity_GMEIN', header: 'Order quantity'},
    //     { field: 'deliveredQuantity_GMEIN', header: 'Delivered quantity'},
    //     { field: 'confirmedQuantity_GMEIN', header: 'Confirmed quantity'},
    //     { field: 'unitOfMeasure_GMEIN', header: 'Unit of measure'},
    //     { field: 'batch', header: 'Batch'},
    //     { field: 'sequenceNumber', header: 'Sequence number', customExportHeader: 'Sequence Number'},
    //     { field: 'createdOn', header: 'Created on'},
    //     { field: 'orderType', header: 'Order Type'},
    //     { field: 'systemStatus', header: 'System Status'},
    //     { field: 'enteredBy', header: 'Entered by'},
    //     { field: 'postingDate', header: 'Posting Date'},
    //     { field: 'statusProfile', header: 'Status Profile'},
    //     { field: 'work_order', header: 'work order'},
    //     { field: 'reciving_date', header: 'W/O ADD Date '},
    //     { field: 'delivery_date', header: 'w/o Delivery Date'},
    //     { field: 'sap_responsible_person_name', header: 'Responsible'},
    //     { field: 'module_name', header: 'Module'},
    //     { field: 'sap_segment_name', header: 'Segment'},
    //     { field: 'customer', header: 'Customer'},
    //     { field: 'finish', header: 'Finish'},
    //     { field: 'finish_wt', header: 'Finish Wt.'},
    //     { field: 'size', header: 'Size'},
    //     { field: 'prod_group_name', header: 'Group'},
    //     { field: 'length', header: 'Length'},
    //     { field: 'spec', header: 'SPEC'},
    //     { field: 'rod_dia1', header: 'ROD DIA1.'},
    //     { field: 'drawn_dia1', header: 'DRAWN DIA.1'},
    //     { field: 'no_of_mc', header: 'No.OF M/C'},
    //     { field: 'machine_name', header: 'M/C-NAME'},
    //     { field: 'machine_speed', header: 'SPEED'},
    //     { field: 'seg2_name', header: 'Seg-2'},
    //     { field: 'seg3_name', header: 'Seg-3'},
    //     { field: 'to_forge_qty', header: 'To forge Qty'},
    //     { field: 'to_forge_wt', header: 'To forge Wt'},
    //     { field: 'to_forge_rm_wt', header: 'To forge RM Wt'},
    //     { field: 'final_pending_qty', header: 'Final Pending Qty'},
    //     { field: 'pending_qty', header: 'Pending Qty'},
    //     { field: 'pending_wt', header: 'Pending Wt.'},
    //     { field: 'pending_rm_wt', header: 'Pending RM Wt.'},
    //     { field: 'no_of_day_pending', header: 'Number of Day Pending'},
    //     { field: 'forge_commite_week', header: 'Forging Commite Week'},
    //     { field: 'forged_so_far', header: 'NOV Forged Qty .'},
    //     { field: 'plan_no_of_mc', header: 'Plan NO. OF M/C'},
    //     { field: 'per_of_efficiency', header: '% of efficiency'},
    //     { field: 'per_day_booking', header: 'Per Day Booking'},
    //     { field: 'pending_form_outside', header: 'Pending From Outside'},
    //     { field: 'no_of_day_pending', header: 'NO. OF DAY Pending'},
    //     { field: 'allocated_product_qty', header: 'Allocated product  Qty '},
    //     { field: 'allocated_product_wt', header: 'Allocated Product Wt'},
    //     { field: 'allocated_balance_rm_wt', header: 'Allocated Balance RM Wt'},
    //     { field: 'special_remarks', header: 'SPECIAL REMARKS'},
    //     { field: 'rm_delivery_date', header: 'RM Delivery Date'},
    //     { field: 'advance_final_rm_wt', header: 'Advance Final RM Wt.'},
    //     { field: 'rm_allocation_priority', header: 'RM Allocation Priority '},
    //     { field: 'this_month_forge_wt', header: 'This Month Forge Wt.'},
    //     { field: 'this_month_forge_rm_wt', header: 'This Month Forge RM Wt'},
    //     { field: 'act_allocated_balance_rm_wt', header: 'Act allocated Balance RM Wt'},
    // ];

    this.cols = [
      { field: 'sap_orderNumber', header: 'SAP Order Number' },
      { field: 'pm_order_number', header: 'Product Master Order' },
      { field: 'systemStatus', header: 'System Status' },
      { field: 'orderQuantity_GMEIN', header: 'Order quantity' },
      { field: 'deliveredQuantity_GMEIN', header: 'Delivered quantity' },
      { field: 'confirmedQuantity_GMEIN', header: 'Confirmed quantity' },
      { field: 'monthly_plan', header: 'Monthly Plan' },
      { field: 'monthly_fix_plan', header: 'Monthly Fix Plan' },
      { field: 'weekly_plan', header: 'Weekly Plan' },
      { field: 'materialNumber', header: 'Material Number' },
      { field: 'materialDescription', header: 'Material Description' },
      { field: 'sap_plant', header: 'Plant' },
      // { field: 'wom_plant', header: 'WOM Plant' },
      { field: 'unitOfMeasure_GMEIN', header: 'Unit of Measure' },
      { field: 'batch', header: 'Batch' },
      { field: 'work_order', header: 'Work Order' },
      { field: 'reciving_date', header: 'W/O ADD Date' },
      { field: 'delivery_date', header: 'W/O Delivery Date' },
      { field: 'wo_add_date', header: 'WO ADD Date (Alt)' },
      // { field: 'work_order_db', header: 'Work Order DB' },
      { field: 'customer', header: 'Customer' },
      { field: 'responsible_person_name', header: 'Responsible' },
      { field: 'marketing_person_name', header: 'Marketing Person' },
      // { field: 'wom_segment_id', header: 'Segment ID' },
      { field: 'wom_segment_name', header: 'Segment' },
      // { field: 'quality_inspection_required', header: 'Quality Inspection Required' },
      { field: 'finish_wt', header: 'Finish Wt.' },
      { field: 'to_forge_qty', header: 'To Forge Qty' },
      { field: 'to_forge_wt', header: 'To Forge Wt' },
      { field: 'forged_so_far', header: 'NOV Forged Qty' },
      { field: 'this_month_forge_wt', header: 'This Month Forge Wt.' },
      // { field: 'module_id', header: 'Module ID' },
      { field: 'module_name', header: 'Module' },
      // { field: 'seg2_id', header: 'Seg-2 ID' },
      { field: 'seg2_name', header: 'Seg-2' },
      // { field: 'seg3_id', header: 'Seg-3 ID' },
      { field: 'seg3_name', header: 'Seg-3' },
      // { field: 'finish_id', header: 'Finish ID' },
      { field: 'finish_name', header: 'Finish' },
      // { field: 'group_id', header: 'Group ID' },
      { field: 'group_name', header: 'Group' },
      { field: 'machine_name', header: 'M/C-NAME' },
      { field: 'no_of_machines', header: 'No.OF M/C' },
      { field: 'cheese_wt', header: 'Cheese Wt' },
      { field: 'size', header: 'Size' },
      { field: 'length', header: 'Length' },
      { field: 'spec', header: 'SPEC' },
      { field: 'rod_dia1', header: 'ROD DIA1' },
      { field: 'drawn_dia1', header: 'DRAWN DIA.1' },
      { field: 'condition_of_rm', header: 'Condition of RM' },
      // { field: 'pm_special_remarks', header: 'Special Remarks' },
      { field: 'main_special_remarks', header: 'Special Remarks' },
      { field: 'pm_bom', header: 'PM BOM' },
      { field: 'rm_component', header: 'RM Component' },
      { field: 'rm_allocation_priority', header: 'RM Allocation Priority' },
      { field: 'rm_delivery_date', header: 'RM Delivery Date' },
      // { field: 'module_multiplier', header: 'Module Multiplier' },
      { field: 'to_forge_rm_wt', header: 'To Forge RM Wt' },
      { field: 'total_allocation', header: 'Total Allocation' },
      { field: 'total_allocation_2', header: 'Total Allocation 2' },
      { field: 'plan_print_qty', header: 'Plan Print Qty' },
      { field: 'this_month_forge_rm_wt', header: 'This Month Forge RM Wt' },
      { field: 'act_allocated_balance_rm_wt', header: 'Act Allocated Balance RM Wt' },
      { field: 'allocated_balance_rm_wt', header: 'Allocated Balance RM Wt' },
      { field: 'rm_correction', header: 'RM Correction' },
      { field: 'plan_allocation', header: 'Plan Allocation' },
      { field: 'allocated_product_wt', header: 'Allocated Product Wt' },
      { field: 'allocated_product_qty', header: 'Allocated Product Qty' },
      { field: 'per_of_efficiency', header: '% of Efficiency' },
      { field: 'machine_speed', header: 'Speed' },
      { field: 'no_of_shift', header: 'No. of Shift' },
      { field: 'plan_no_of_machine', header: 'Plan NO. OF M/C' },
      { field: 'per_day_booking', header: 'Per Day Booking' },
      { field: 'final_pending_qty', header: 'Final Pending Qty' },
      { field: 'pending_qty', header: 'Pending Qty' },
      { field: 'pending_wt', header: 'Pending Wt.' },
      { field: 'pending_rm_wt', header: 'Pending RM Wt.' },
      { field: 'pending_from_outside_1', header: 'Pending From Outside 1' },
      { field: 'pending_from_outside', header: 'Pending From Outside' },
      { field: 'no_of_days_booking', header: 'No. of Days Booking' },
      { field: 'no_of_day_weekly_planning', header: 'No. of Day Weekly Planning' },
      // { field: 'created_at', header: 'Created On' }
    ];

    this.authService.currentUser.subscribe({
          next: (user) => {
            if (user){
              this.isRmUser = user.role == this.constantService.RM;
              this.isAdminUser = user.role == this.constantService.ADMIN;
            }
          }
      });

    this._selectedColumns = this.cols;
    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    this.load_STProcess();
    this.loadData(1);
  }

  onSort(event: any){
    console.log(event)
  }

  load_STProcess(){
    this.loadingSurfaceTreatment = true;
    this.adminApiService.get_surface_treatment_process().subscribe({
      next: (res: any)=>{
        this.STPData = res.data;
        this.loadingSurfaceTreatment = false;
      }, 
      error: (err: any)=>{
        this.loadingSurfaceTreatment = false;
      }
    });
  }

  sortingField(field: string){
    console.log(field);
    this.sortBy = {field: field, value:1};
    this.cdr.detectChanges();
    this.loadData(this.page);
  }
  rSortingField(field: string){
    console.log(field);
    this.sortBy = {field: field, value:-1};
    this.cdr.detectChanges();
    this.loadData(this.page);
  }

  get selectedColumns(): Column[] {
      return this._selectedColumns;
  }
  handleSort(event: any) {
    console.log('Sort event:', event);

    // Optional: "terminate" by not processing data or triggering lazy load
    // If you're using [lazy]="true", don't call your backend here
  }

  handleFilter(event: any) {
    console.log('Filter event:', event);

    // Optional: terminate or handle filtering yourself
  }

  findKeyValue(): void {
    if(this.sapFilters){
      const allFilters: any = {};
      for(const key in this.sapFilters) {
        allFilters[key]={matchMode: 'contains', value: null} ;
      }
      this.filterForObj = allFilters;
      console.log(allFilters);
    }
  }

  onFilterClick(index: number, event: Event, field: string){
    console.log(index)
    console.log(event)
    this.currentPanelId = index;
    this.selectedFilters = [];
    this.currentFilterField = field;
    const panel = this.overlayPanels.toArray()[index];
    // panel.toggle(event);
    if (panel) {
      panel.toggle(event);
    } else {
      console.warn('Overlay panel not found at index', index);
    }
    for(const key in this.sapFilters) {
      if(key === field){
        this.filterForArray = this.sapFilters[key] 
      }
    }
    
  }

  onFilterApply(index: number|null=null, event: Event|null=null){
    console.log(index)
    console.log(event)
    console.log(this.currentPanelId);
    let panel: any;
    if(index){
      panel = this.overlayPanels.toArray()[index];
    } if(this.currentPanelId){
      panel = this.overlayPanels.toArray()[this.currentPanelId];
    }
    // panel.toggle(event);
    if (panel) {
      panel.toggle(event);
      this.currentPanelId = null;
    } else {
      console.warn('Overlay panel not found at index', index);
    }
    if (this.filterForObj && this.currentFilterField in this.filterForObj) {
      this.filterForObj[this.currentFilterField].value = this.selectedFilters;
      this.loadData(this.page);

    } else {
      console.warn(`this.currentFilterField "${this.currentFilterField}" not found in filterForObj`);
    }
    console.log(this.filterForObj);
  }

  onFilterClear(index: number, event: Event, field: string){
    console.log(index)
    console.log(event)
    console.log(this.currentPanelId);
    console.log(this.filterForObj);
    console.log(field);
    // let panel: any;
    // if(index){
    //   panel = this.overlayPanels.toArray()[index];
    // } if(this.currentPanelId){
    //   panel = this.overlayPanels.toArray()[this.currentPanelId];
    // }
    // // panel.toggle(event);
    // if (panel) {
    //   panel.toggle(event);
    //   this.currentPanelId = null;
    // } else {
    //   console.warn('Overlay panel not found at index', index);
    // }
    if (this.filterForObj && field in this.filterForObj) {
      this.filterForObj[field].value = null;
      console.log(this.filterForObj)
      this.selectedFilters = [];
      this.loadData(this.page);

    } else {
      console.warn(`field "${field}" not found in filterForObj`);
    }
  }

  onFilterCancel(index: number, event: Event){
    console.log(index)
    console.log(event)
    console.log(this.currentPanelId);
    let panel: any;
    if(index){
      panel = this.overlayPanels.toArray()[index];
    } if(this.currentPanelId){
      panel = this.overlayPanels.toArray()[this.currentPanelId];
    }
    // panel.toggle(event);
    if (panel) {
      panel.toggle(event);
      this.currentPanelId = null;
    } else {
      console.warn('Overlay panel not found at index', index);
    }
    if (this.filterForObj && this.currentFilterField in this.filterForObj) {
      this.filterForObj[this.currentFilterField].value = null;
    } else {
      console.warn(`this.currentFilterField "${this.currentFilterField}" not found in filterForObj`);
    }
  }

  set selectedColumns(val: Column[]) {
      //restore original order
      this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  onPageChange(event: PageEvent) {
    console.log(event)
    this.page = Number(event.page)+1;
    this.loadData(this.page);
  }

  loadSAPFilters(){
    this.loadingSAPFilters = true;
    this.adminApiService.load_sap_filters().subscribe({
      next: (res: any)=>{
        this.sapFilters = res;
        this.findKeyValue();
        this.loadingSAPFilters = false;
      }, 
      error: (err: any)=>{
        console.log(err);
        this.loadingSAPFilters = false;
      }
    });
  }
  
  loadData(page){
    this.loading_data = true;
    const filters = {};
    for(const key in this.filterForObj) {
      if(this.filterForObj[key]?.value != null){
        filters[key] = this.filterForObj[key] ;
      }
    }
    
    this.adminApiService.get_sap_data({orderBy: this.sortBy, filterBy: filters}, page).subscribe({
      next: (res: any)=>{
        // this.data = res.data.map((val: any)=> {
        //   return this.unbrakoPPCommonService.SAPMainFileMapping(val);
        // });
        this.data = res.data;
        this.pagination = res.pagination;
        // this.data = [this.data[0], this.data[1], this.data[2], this.data[3], this.data[4], this.data[5], this.data[6], this.data[7], this.data[8], this.data[9]];
        console.log(this.data);
        const fileName = 'MyExcelFile';
        // this.excelService.generateExcelFile(fileName, this.data);
        this.loading_data = false;
        if(!this.sapFilters){
          this.loadSAPFilters();
        }
        // this.generatePivotTable();
      }, 
      error: (err: any)=>{
        console.log(err);
        this.loading_data = false;
      }
    });
  }

  showAddMainFileDialog(row){
    this.visibleMainFileDialog = true;
    this.selectedRow = row;
  }

  onChildNotify(val: any): void {
    console.log('Notification from child:', val);
    if(val){
      // this.updateDataFromChild(this.unbrakoPPCommonService.SAPMainFileMapping(val))
      this.visibleAdminUpdateDialog = false; // Close the dialog or perform any action
    }
  }

  updateDataFromChild(val){
    // Find index of object with id 1
    let index = this.data.findIndex(item => item.id === val.id);

    if (index !== -1) {
        this.data[index] = val; // Replace object
    }
  }



  //////////////////////////////////////////////////////////////////////////////////////////////
  segments: any[] = [];
  persons: any[] = [];
  pivotTable: { [segment: string]: { [person: string]: number } } = {};
  rowTotals: { [segment: string]: number } = {};
  columnTotals: { [person: string]: number } = {};
  grandTotal: number = 0;

  generatePivotTable(): void {
    // Step 1: Extract unique segment names and person names
    this.segments = [...new Set(this.data.map(item => item.sap_segment_name))];
    this.persons = [...new Set(this.data.map(item => item.sap_responsible_person_name))];

    // Step 2: Initialize pivot structure with 0
    this.pivotTable = {};
    this.columnTotals = {};

    this.segments.forEach(segment => {
      this.pivotTable[segment] = {};
      this.persons.forEach(person => {
        this.pivotTable[segment][person] = 0;
        this.columnTotals[person] = 0;
      });
    });

    // Step 3: Populate pivot table
    this.data.forEach(({ sap_segment_name, sap_responsible_person_name, to_forge_qty }) => {
      this.pivotTable[sap_segment_name][sap_responsible_person_name] += to_forge_qty;
    });

    // Step 4: Compute row totals and column totals
    this.rowTotals = {};
    this.segments.forEach(segment => {
      this.rowTotals[segment] = 0;
      this.persons.forEach(person => {
        this.rowTotals[segment] += this.pivotTable[segment][person];
        this.columnTotals[person] += this.pivotTable[segment][person];
      });
    });

    // Compute the grand total
    this.grandTotal = Object.values(this.rowTotals).reduce((sum, val) => sum + val, 0);
  }

  showUpdateForm(){
    console.log(this.selectedRecords.length)
    if(this.selectedRecords.length && ((this.isRmUser && this.today.getDay() !== 6) || this.isAdminUser)){
      this.visibleAdminUpdateDialog = true;
    }
  }
  
}
  