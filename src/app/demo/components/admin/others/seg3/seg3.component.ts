import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-seg3',
  templateUrl: './seg3.component.html',
  styleUrl: './seg3.component.scss'
})
export class Seg3Component implements OnInit {
  seg2Data!: any;
  loadingSeg3: boolean = false;
  visibleAddSeg3Dialog: boolean = false;

  constructor(
    private adminApiService: AdminApiService
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
    this.visibleAddSeg3Dialog = true;
  }

  onChildNotify(message: boolean): void {
    console.log('Notification from child:', message);
    if(message){
      this.load_seg3_data();
      this.visibleAddSeg3Dialog = false; // Close the dialog or perform any action
    }
  }
}
