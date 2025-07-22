import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  customersData!: any;
  loadingCD: boolean = false;
  visibleAddCustomerDialog: boolean = false;
  breadcrumbItems: any[];
  constructor(
    private adminApiService: AdminApiService
  ){}
  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'Customers' }
    ];
    this.load_customers()
  }

  load_customers(){
    this.loadingCD = true;
    this.adminApiService.get_all_customers().subscribe({
      next: (res: any)=>{
        this.customersData = res.data;
        this.loadingCD = false;
      }, 
      error: (err: any)=>{
        this.loadingCD = false;

      }
    });
  }

  showAddCustomerDialog(){
    this.visibleAddCustomerDialog = true;
  }

  onChildNotify(message: boolean): void {
    console.log('Notification from child:', message);
    if(message){
      this.load_customers();
      this.visibleAddCustomerDialog = false; // Close the dialog or perform any action
    }
  }
}
