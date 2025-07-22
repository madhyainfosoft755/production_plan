import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-forging-daily-update',
  templateUrl: './daily-update.component.html',
  styles: `
  `
})
export class DailyUpdateComponent implements OnInit {
  data: any;
  
  constructor(
    private adminApiService: AdminApiService
  ){}

  ngOnInit() :void {
  }
  
  }
  