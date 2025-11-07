import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { ExcelService } from 'src/app/services/excel.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.scss'
})
export class ModulesComponent implements OnInit {
  modulesData!: any;
  loadingModules: boolean = false;
  visibleAddModuleDialog: boolean = false;
  selectedModule: any = null;

  constructor(
    private adminApiService: AdminApiService,
    private excelService: ExcelService,
    private datePipe: DatePipe
  ){}

  ngOnInit(): void {
    this.load_modules_data();
  }

  load_modules_data(){
    this.loadingModules = true;
    this.adminApiService.get_all_modules().subscribe({
      next: (res: any)=>{
        this.modulesData = res.data;
        this.loadingModules = false;
      }, 
      error: (err: any)=>{
        this.loadingModules = false;
      }
    });
  }

  showAddModuleDialog(){
    this.selectedModule = null;
    this.visibleAddModuleDialog = true;
  }
  
  editModuleDialog(selectedModule: any){
    this.selectedModule = selectedModule;
    this.visibleAddModuleDialog = true;
  }

  onChildNotify(message: boolean): void {
    if(message){
      this.load_modules_data();
      this.visibleAddModuleDialog = false; // Close the dialog or perform any action
    }
  }

  exportExcel() {
    const fileDate = this.datePipe.transform(new Date(), 'dd_MM_yyyy');

    const exportData = this.modulesData.map((r: any, i: number) => ({
      'SN': i+1,
      'Name': r.name,
      'Responsible': r.responsible + ' ' + r.role,
      'Added At': this.datePipe.transform(r.created_at, 'dd-MM-yyyy'),
    }));

    this.excelService.exportToExcel(exportData, `Modules_Data_${fileDate}`);
  }
}
