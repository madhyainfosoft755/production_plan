import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { ExcelService } from 'src/app/services/excel.service';
import { UnbrakoPPCommonService } from 'src/app/services/unbrako-pp-common';
import { DatePipe } from '@angular/common';


interface ProductionRow {
  sap_id: string;
  materialNumber: string;
  materialDescription: string;
  module_responsible_person_name: string;
  module_name: string;
  seg2_name: string;
  total_production_qty: number;
  total_production_wt: number;
  today_qty: number;
  today_wt: number;
}

interface DisplayRow extends Partial<ProductionRow> {
  isTotal?: boolean;
  isGrandTotal?: boolean;
}


@Component({
  selector: 'app-daily-output',
  templateUrl: './daily-output.component.html',
  styleUrl: './daily-output.component.scss'
})
export class DailyOutputComponent implements OnInit {
  breadcrumbItems: any[];
  selectedDate = new Date();
  maxValidDate = new Date();
  loading_data = false;
  reportData: any[] = [];

  constructor(
    private adminApiService: AdminApiService,
    private unbrakoPPCommonService: UnbrakoPPCommonService,
    private excelService: ExcelService,
    private datePipe: DatePipe
  ){}

  ngOnInit() :void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'Daily Output' }
    ];

    this.loadReportData();
  }

  onDateSelect(event: Date) {
    // console.log('Selected date:', event);
    // // Optionally format it
    // console.log('Formatted date:', this.unbrakoPPCommonService.getFormatedDate(event));
    this.selectedDate = event;
    this.loadReportData(this.unbrakoPPCommonService.getFormatedDate(event));
  }

  loadReportData(date: string = this.unbrakoPPCommonService.getFormatedDate(this.selectedDate)) :void {
    this.loading_data = true;
    // console.log(this.adminApiService.get_daily_output(date).subscribe());
    this.adminApiService.get_daily_output(date).subscribe({
      next: (res)=>{
        console.log(res)
        this.reportData = this.processReportData(res.data);
        console.log(this.processReportData(res.data))
        // console.log(res)
        // console.log(res.data)
        this.loading_data = false;
      }, 
      error: (err: any)=>{
        this.loading_data = false;
      }
    });
  }


  processReportData(data: ProductionRow[]): DisplayRow[] {
    const result: DisplayRow[] = [];
    let grandTotalQty = 0;
    let grandTotalWt = 0;
    let grandTodayQty = 0;
    let grandTodayWt = 0;

    // Group by responsible -> module
    const grouped = data.reduce((acc, row) => {
      const key = `${row.module_responsible_person_name}|${row.module_name}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {} as Record<string, ProductionRow[]>);

    // Build display array
    for (const key in grouped) {
      const [responsible, module] = key.split('|');
      const rows = grouped[key];

      let moduleTotalQty = 0;
      let moduleTotalWt = 0;
      let moduleTodayQty = 0;
      let moduleTodayWt = 0;

      // Add each row
      for (const r of rows) {
        result.push(r);

        moduleTotalQty += +r.total_production_qty;
        moduleTotalWt += +r.total_production_wt;
        moduleTodayQty += +r.today_qty;
        moduleTodayWt += +r.today_wt;
      }

      // Push module total row
      result.push({
        module_responsible_person_name: responsible,
        module_name: module,
        seg2_name: 'Total',
        total_production_qty: moduleTotalQty,
        total_production_wt: moduleTotalWt,
        today_qty: moduleTodayQty,
        today_wt: moduleTodayWt,
        isTotal: true,
      });

      // Add to grand total
      grandTotalQty += moduleTotalQty;
      grandTotalWt += moduleTotalWt;
      grandTodayQty += moduleTodayQty;
      grandTodayWt += moduleTodayWt;
    }

    // Add grand total at the end
    result.push({
      seg2_name: 'Grand Total',
      total_production_qty: grandTotalQty,
      total_production_wt: grandTotalWt,
      today_qty: grandTodayQty,
      today_wt: grandTodayWt,
      isGrandTotal: true,
    });

    return result;
  }


  exportExcel() {
    const monthFull = this.datePipe.transform(this.selectedDate, 'MMMM'); // e.g. November
    const displayDate = this.datePipe.transform(this.selectedDate, 'dd-MM-yyyy'); // e.g. 06-11-2025
    const fileDate = this.datePipe.transform(this.selectedDate, 'dd_MM_yyyy');   // e.g. 06_11_2025

    const exportData = this.reportData.map(r => ({
      'Responsible': r.module_responsible_person_name,
      'Module': r.module_name,
      'Seg-2': r.seg2_name,
      [`Sum of ${monthFull} Forged Qty.`]: r.total_production_qty,
      [`Sum of ${monthFull} Forged WT.`]: r.total_production_wt,
      [`Sum of DAY Qty. (${displayDate})`]: r.today_qty,
      [`Sum of DAY WT. (${displayDate})`]: r.today_wt
    }));

    this.excelService.exportToExcel(exportData, `Daily_Output_Report_${fileDate}`);
  }
}
