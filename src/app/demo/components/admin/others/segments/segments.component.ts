import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrl: './segments.component.scss'
})
export class SegmentsComponent implements OnInit {
  segmentsData!: any;
  loadingSegments: boolean = false;
  visibleAddSegmentDialog: boolean = false;

  constructor(
    private adminApiService: AdminApiService
  ){}

  ngOnInit(): void {
    this.load_segments_data();
  }

  load_segments_data(){
    this.loadingSegments = true;
    this.adminApiService.get_all_segments().subscribe({
      next: (res: any)=>{
        this.segmentsData = res.data;
        this.loadingSegments = false;
      }, 
      error: (err: any)=>{
        this.loadingSegments = false;
      }
    });
  }

  showAddSegmentDialog(){
    this.visibleAddSegmentDialog = true;
  }

  onChildNotify(message: boolean): void {
    console.log('Notification from child:', message);
    if(message){
      this.load_segments_data();
      this.visibleAddSegmentDialog = false; // Close the dialog or perform any action
    }
  }
}
