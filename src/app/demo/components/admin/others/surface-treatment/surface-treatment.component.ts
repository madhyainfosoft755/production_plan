import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-surface-treatment',
  templateUrl: './surface-treatment.component.html',
  styleUrl: './surface-treatment.component.scss'
})
export class SurfaceTreatmentComponent implements OnInit {
  STPData!: any;
  loadingSurfaceTreatment: boolean = false;
  visibleAddSTPDialog: boolean = false;

  constructor(
    private adminApiService: AdminApiService
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
    this.visibleAddSTPDialog = true;
  }

  onChildNotify(message: boolean): void {
    console.log('Notification from child:', message);
    if(message){
      this.load_STProcess();
      this.visibleAddSTPDialog = false; // Close the dialog or perform any action
    }
  }
}
