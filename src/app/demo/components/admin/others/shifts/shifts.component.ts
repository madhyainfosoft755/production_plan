import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.scss'
})
export class ShiftsComponent implements OnInit {
  shifts!: any;
  loadingShifts: boolean = false;

  constructor(
    private adminApiService: AdminApiService
  ){}

  ngOnInit(): void {
    this.load_shifts_data();
  }

  load_shifts_data(){
    this.loadingShifts = true;
    this.adminApiService.get_all_shifts().subscribe({
      next: (res: any)=>{
        this.shifts = res.data;
        this.loadingShifts = false;
      }, 
      error: (err: any)=>{
        this.loadingShifts = false;
      }
    });
  }

}
