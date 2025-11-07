import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { ExcelService } from 'src/app/services/excel.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-seg3',
  templateUrl: './seg3.component.html',
  styleUrl: './seg3.component.scss'
})
export class Seg3Component implements OnInit {
  seg2Data!: any;
  loadingSeg3: boolean = false;
  visibleAddSeg3Dialog: boolean = false;
  selectedSeg3: any = null;

  constructor(
    private adminApiService: AdminApiService,
    private excelService: ExcelService,
    private datePipe: DatePipe
  ){}

  ngOnInit(): void {
    this.load_seg3_data();
  }

  load_seg3_data(){
    this.loadingSeg3 = true;
    this.adminApiService.get_all_seg3().subscribe({
      next: (res: any)=>{
        this.seg2Data = res.data;
        this.loadingSeg3 = false;
      }, 
      error: (err: any)=>{
        this.loadingSeg3 = false;
      }
    });
  }

  showAddSeg3Dialog(){
    this.selectedSeg3 = null;
    this.visibleAddSeg3Dialog = true;
  }
  
  editSeg3Dialog(selectedSeg3: any){
    this.selectedSeg3 = selectedSeg3;
    this.visibleAddSeg3Dialog = true;
  }

  onChildNotify(message: boolean): void {
    if(message){
      this.load_seg3_data();
      this.visibleAddSeg3Dialog = false; // Close the dialog or perform any action
    }
  }

  exportExcel() {
    const fileDate = this.datePipe.transform(new Date(), 'dd_MM_yyyy');

    const exportData = this.seg2Data.map((r: any, i: number) => ({
      'SN': i+1,
      'Name': r.name,
      'Added At': this.datePipe.transform(r.created_at, 'dd-MM-yyyy'),
    }));

    this.excelService.exportToExcel(exportData, `Seg3_Data_${fileDate}`);
  }
}
