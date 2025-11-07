import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { ExcelService } from 'src/app/services/excel.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-surface-treatment',
  templateUrl: './surface-treatment.component.html',
  styleUrl: './surface-treatment.component.scss'
})
export class SurfaceTreatmentComponent implements OnInit {
  STPData!: any;
  loadingSurfaceTreatment: boolean = false;
  visibleAddSTPDialog: boolean = false;
  selectedSTP: any = null;

  constructor(
    private adminApiService: AdminApiService,
    private excelService: ExcelService,
    private datePipe: DatePipe
  ){}

  ngOnInit(): void {
    this.load_STProcess();
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

  showAddSTPDialog(){
    this.selectedSTP = null;
    this.visibleAddSTPDialog = true;
  }
  
  editSTPDialog(selectedSTP: any){
    this.selectedSTP = selectedSTP;
    this.visibleAddSTPDialog = true;
  }

  onChildNotify(message: boolean): void {
    if(message){
      this.load_STProcess();
      this.visibleAddSTPDialog = false; // Close the dialog or perform any action
    }
  }

  exportExcel() {
    const fileDate = this.datePipe.transform(new Date(), 'dd_MM_yyyy');

    const exportData = this.STPData.map((r: any, i: number) => ({
      'SN': i+1,
      'Name': r.name,
      'Added At': this.datePipe.transform(r.created_at, 'dd-MM-yyyy'),
    }));

    this.excelService.exportToExcel(exportData, `Surface_Treatment_Data_${fileDate}`);
  }
}
