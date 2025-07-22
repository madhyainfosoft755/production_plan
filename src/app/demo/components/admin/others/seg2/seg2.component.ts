import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-seg2',
  templateUrl: './seg2.component.html',
  styleUrl: './seg2.component.scss'
})
export class Seg2Component implements OnInit {
  seg2Data!: any;
  loadingSeg2: boolean = false;
  visibleAddSeg2Dialog: boolean = false;

  constructor(
    private adminApiService: AdminApiService
  ){}

  ngOnInit(): void {
    this.load_seg2_data();
  }

  load_seg2_data(){
    this.loadingSeg2 = true;
    this.adminApiService.get_all_seg2().subscribe({
      next: (res: any)=>{
        this.seg2Data = res.data;
        this.loadingSeg2 = false;
      }, 
      error: (err: any)=>{
        this.loadingSeg2 = false;
      }
    });
  }

  showAddSeg2Dialog(){
    this.visibleAddSeg2Dialog = true;
  }

  onChildNotify(message: boolean): void {
    console.log('Notification from child:', message);
    if(message){
      this.load_seg2_data();
      this.visibleAddSeg2Dialog = false; // Close the dialog or perform any action
    }
  }
}
