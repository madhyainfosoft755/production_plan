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
  selectedSeg2: any = null;

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
    this.selectedSeg2 = null;
    this.visibleAddSeg2Dialog = true;
  }

  editSeg2Dialog(selectedSeg2: any){
    this.selectedSeg2 = selectedSeg2;
    this.visibleAddSeg2Dialog = true;
  }

  onChildNotify(message: boolean): void {
    if(message){
      this.load_seg2_data();
      this.visibleAddSeg2Dialog = false; // Close the dialog or perform any action
    }
  }
}
