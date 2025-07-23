import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminApiService } from 'src/app/services/adminapi.service';

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
    private router: Router
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
    console.log('Notification from child:', message);
    if(message){
      this.load_machines();
      this.visibleAddMachineDialog = false; // Close the dialog or perform any action
    }
  }

  showMachineEdit(machine: any){
    this.selectedMachine = machine;
    this.visibleAddMachineDialog = true;
  }
}
