import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit {
  employeesData!: any;
  loadingED: boolean = false;
  visibleAddEmployeeDialog: boolean = false;
  breadcrumbItems: any[];
  constructor(
    private adminApiService: AdminApiService
  ){}
  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'Employees' }
    ];
    this.load_customers()
  }

  load_customers(){
    this.loadingED = true;
    this.adminApiService.get_all_employees().subscribe({
      next: (res: any)=>{
        this.employeesData = res.data;
        this.loadingED = false;
      }, 
      error: (err: any)=>{
        this.loadingED = false;

      }
    });
  }

  showAddEmployeeDialog(){
    this.visibleAddEmployeeDialog = true;
  }

  onChildNotify(message: boolean): void {
    console.log('Notification from child:', message);
    if(message){
      this.load_customers();
      this.visibleAddEmployeeDialog = false; // Close the dialog or perform any action
    }
  }
}
