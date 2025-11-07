import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { ExcelService } from 'src/app/services/excel.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrl: './segments.component.scss'
})
export class SegmentsComponent implements OnInit {
  segmentsData!: any;
  loadingSegments: boolean = false;
  visibleAddSegmentDialog: boolean = false;
  selectedSegment: any = null;

  constructor(
    private adminApiService: AdminApiService,
    private excelService: ExcelService,
    private datePipe: DatePipe
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
    this.selectedSegment = null;
    this.visibleAddSegmentDialog = true;
  }
  
  editSegmentDialog(selectedSegment: any){
    this.selectedSegment = selectedSegment;
    this.visibleAddSegmentDialog = true;
  }

  onChildNotify(message: boolean): void {
    if(message){
      this.load_segments_data();
      this.visibleAddSegmentDialog = false; // Close the dialog or perform any action
    }
  }

  exportExcel() {
    const fileDate = this.datePipe.transform(new Date(), 'dd_MM_yyyy');

    const exportData = this.segmentsData.map((r: any, i: number) => ({
      'SN': i+1,
      'Name': r.name,
      'Added At': this.datePipe.transform(r.created_at, 'dd-MM-yyyy'),
    }));

    this.excelService.exportToExcel(exportData, `Segment_Data_${fileDate}`);
  }
}
