import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrl: './finish.component.scss'
})
export class FinishComponent implements OnInit {
  finishData!: any;
  loadingFinish: boolean = false;
  visibleAddFinishDialog: boolean = false;

  constructor(
    private adminApiService: AdminApiService
  ){}

  ngOnInit(): void {
    this.load_finish_data();
  }

  load_finish_data(){
    this.loadingFinish = true;
    this.adminApiService.get_all_finish().subscribe({
      next: (res: any)=>{
        this.finishData = res.data;
        this.loadingFinish = false;
      }, 
      error: (err: any)=>{
        this.loadingFinish = false;
      }
    });
  }

  showAddFinishDialog(){
    this.visibleAddFinishDialog = true;
  }

  onChildNotify(message: boolean): void {
    console.log('Notification from child:', message);
    if(message){
      this.load_finish_data();
      this.visibleAddFinishDialog = false; // Close the dialog or perform any action
    }
  }
}
