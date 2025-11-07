import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { ExcelService } from 'src/app/services/excel.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrl: './finish.component.scss'
})
export class FinishComponent implements OnInit {
  finishData!: any;
  loadingFinish: boolean = false;
  visibleAddFinishDialog: boolean = false;
  selectedFinish: any = null;

  constructor(
    private adminApiService: AdminApiService,
    private excelService: ExcelService,
    private datePipe: DatePipe
  ){}

  ngOnInit(): void {
    this.load_finish_data();
  }

  load_finish_data(){
    this.loadingFinish = true;
    this.adminApiService.get_all_finish().subscribe({
      next: (res: any)=>{
        this.finishData = res.data;
        this.loadingFinish = false;
      }, 
      error: (err: any)=>{
        this.loadingFinish = false;
      }
    });
  }

  showAddFinishDialog(){
    this.selectedFinish = null;
    this.visibleAddFinishDialog = true;
  }

  editFinishDialog(selectedFinish: any){
    this.selectedFinish = selectedFinish;
    this.visibleAddFinishDialog = true;
  }

  onChildNotify(message: boolean): void {
    if(message){
      this.load_finish_data();
      this.visibleAddFinishDialog = false; // Close the dialog or perform any action
    }
  }

  exportExcel() {
    const fileDate = this.datePipe.transform(new Date(), 'dd_MM_yyyy');

    const exportData = this.finishData.map((r: any, i: number) => ({
      'SN': i+1,
      'Name': r.name,
      'Added At': this.datePipe.transform(r.created_at, 'dd-MM-yyyy'),
    }));

    this.excelService.exportToExcel(exportData, `Finish_Data_${fileDate}`);
  }
}
