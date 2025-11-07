import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrl: './machines.component.scss'
})
export class MachinesComponent implements OnInit {
  machinesData!: any;
  loadingMD: boolean = false;
  visibleAddMachineDialog: boolean = false;
  breadcrumbItems: any[];
  selectedMachine: any;
  constructor(
    private adminApiService: AdminApiService,
    private router: Router,
    private excelService: ExcelService,
    private datePipe: DatePipe
  ){}
  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'Machines' }
    ];
    this.load_machines()
  }

  load_machines(){
    this.loadingMD = true;
    this.adminApiService.get_all_machines().subscribe({
      next: (res: any)=>{
        this.machinesData = res.data;
        this.loadingMD = false;
      }, 
      error: (err: any)=>{
        this.loadingMD = false;

      }
    });
  }

  showAddMachineDialog(){
    this.selectedMachine = null;
    this.visibleAddMachineDialog = true;
  }

  navigateToMachineDetails(machineId: string): void {
    this.router.navigate(['/machine-details', machineId]);
  }

  onChildNotify(message: boolean): void {
    if(message){
      this.load_machines();
      this.visibleAddMachineDialog = false; // Close the dialog or perform any action
    }
  }

  showMachineEdit(machine: any){
    this.selectedMachine = machine;
    this.visibleAddMachineDialog = true;
  }

  exportExcel() {
    const fileDate = this.datePipe.transform(new Date(), 'dd_MM_yyyy');

    const exportData = this.machinesData.map((r: any, i: number) => ({
      'SN': i+1,
      'Process': r.process,
      'Machine Name': r.name,
      'Capacity': r.capacity,
      'No.OF M/C': r.no_of_mc,
      'Speed': r.speed,
      'No. Of Shift': r.no_of_shift,
      'Plan No of M/C<': r.plan_no_of_mc,
      '% of Efficiency': r.per_of_efficiency,
      'Added At': this.datePipe.transform(r.created_at, 'dd-MM-yyyy')
    }));

    this.excelService.exportToExcel(exportData, `Machines_${fileDate}`);
  }
}
