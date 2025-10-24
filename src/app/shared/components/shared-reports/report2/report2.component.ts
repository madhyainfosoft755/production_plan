import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { UnbrakoPPCommonService } from 'src/app/services/unbrako-pp-common';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-report2',
  templateUrl: './report2.component.html',
  styleUrl: './report2.component.scss'
})
export class Report2Component  implements OnInit {
  breadcrumbItems: any[];
  // data: any;
  loading_data: boolean = false;
  visibleMainFileDialog: boolean = false;
  selectedRow: any = null;
  weeks: any[];
  rangeDates: Date[] | undefined;
  month_full_year: Date | undefined;
  selectedWeek: any | undefined;

  columns: string[] = [];
  rows: string[] = [];
  data: any = {};
  
  constructor(
    private adminApiService: AdminApiService,
    private unbrakoPPCommonService: UnbrakoPPCommonService,
    private excelService: ExcelService
  ){}

  ngOnInit() :void {
    this.weeks = this.unbrakoPPCommonService.weeklyPeriods.map((val) => 
      {
        return {name: this.unbrakoPPCommonService.weekStringRepr(val), value: val}
    });
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'Group Segment Report' }
    ];
    this.loadData();
  }
  
  loadData(params: any = {}){
    this.loading_data = true;
    this.adminApiService.get_seg3_wise_data().subscribe({
      next: (res: any)=>{
        this.columns = res.columns;
        this.rows = res.rows;
        this.data = res.data;
        // this.data = res.data.map((val: any)=> {
        //   return this.unbrakoPPCommonService.SAPMainFileMapping(val);
        // });
        // const fileName = 'MyExcelFile';
        // this.excelService.generateExcelFile(fileName, this.data);
        this.loading_data = false;
        // this.generatePivotTable();
      }, 
      error: (err: any)=>{
        this.loading_data = false;
      }
    });
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

  week_change(event: any){
    this.month_full_year = undefined;
    this.rangeDates = undefined;
    this.loadData({
      week_start: this.formatDate(this.selectedWeek.start_date),
      week_end: this.formatDate(this.selectedWeek.end_date)
    });
    // {
    //   "week_number": 3,
    //   "start_date": "2025-01-20T00:00:00.000Z",
    //   "end_date": "2025-01-25T00:00:00.000Z"
    // }
  }
  
  month_select(event: any){
    // Thu May 01 2025 00:00:00 GMT+0530 (India Standard Time)
    this.selectedWeek = undefined;
    this.rangeDates = undefined;
    this.loadData({
      month_full_year: this.formatMonth(this.month_full_year) 
    });
  }
  private formatMonth(date: Date): string {
    return `${date.getMonth() + 1}/${date.getFullYear()}`; // Converts to MM/YYYY
  }
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD format
  }

  date_range_select(event: any){
    if(this.rangeDates[1] !== null){
      this.month_full_year = undefined;
      this.selectedWeek = undefined;
      this.loadData({
        start_date: this.formatDate(this.rangeDates[0]),
        end_date: this.formatDate(this.rangeDates[1])
      });
    }
    // [
    //   "2025-02-12T18:30:00.000Z",
    //   null
    // ]
    // [
    //   "2025-02-12T18:30:00.000Z",
    //   "2025-02-20T18:30:00.000Z"
    // ]
  }

  get_all(){
    this.month_full_year = undefined;
    this.selectedWeek = undefined;
    this.rangeDates = undefined;
    this.loadData();
  }



  getRowTotal(row: string): number {
    let total = 0;
    for (let col of this.columns) {
      total += this.data[row][col] || 0;
    }
    return total;
  }

  getColumnTotal(col: string): number {
    let total = 0;
    for (let row of this.rows) {
      total += this.data[row][col] || 0;
    }
    return total;
  }

  getGrandTotal(): number {
    let total = 0;
    for (let row of this.rows) {
      for (let col of this.columns) {
        total += this.data[row][col] || 0;
      }
    }
    return total;
  }
  
}
  