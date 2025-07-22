import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-forging-this-month',
  templateUrl: './this-month.component.html',
  styleUrl: './this-month.component.scss'
})
export class ThisMonthComponent implements OnInit {
  breadcrumbItems: any[];
  data: any;
  loading_data: boolean = false;
  
  constructor(
    private adminApiService: AdminApiService
  ){}

  ngOnInit() :void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'This Month File' }
    ];
    this.loadData();
  }
  
  loadData(){
    this.loading_data = true;
    this.adminApiService.get_sap_data().subscribe({
      next: (res: any)=>{
        this.data = res.data;
        this.loading_data = false;
      }, 
      error: (err: any)=>{
        console.log(err);
        this.loading_data = false;
      }
    });
  }
  
  }
  