import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit {
  employeesData: any[] = [];
  employee: any = null;
  blockedEmployeesData: any[] = [];
  activeEmployeesData: any[] = [];
  loadingED: boolean = false;
  visibleAddEmployeeDialog: boolean = false;
  breadcrumbItems: any[];
  current = true;
  permissions: {id: number, code: string, description: string}[] | null = null;
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
        this.employeesData = res.data.filter(val=>val.active);
        this.activeEmployeesData = res.data.filter(val=>val.active);
        this.blockedEmployeesData = res.data.filter(val=>!val.active);
        this.permissions = res.permissions.map(val=>{ return {...val, id: Number(val.id)}});
        this.current = true;
        this.loadingED = false;
      }, 
      error: (err: any)=>{
        this.loadingED = false;

      }
    });
  }

  showBlockedEmployees(){
    this.current = false;
    this.employeesData = structuredClone(this.blockedEmployeesData);
  } 

  showActiveEmployees(){
    this.current = true;
    this.employeesData = structuredClone(this.activeEmployeesData);
  }

  showAddEmployeeDialog(){
    this.employee = null;
    this.visibleAddEmployeeDialog = true;
  }

  editEmployee(employee: any){
    this.employee = employee;
    this.visibleAddEmployeeDialog = true;
  }

  onChildNotify(message: boolean): void {
    if(message){
      this.load_customers();
      this.visibleAddEmployeeDialog = false; // Close the dialog or perform any action
    }
  }
}
