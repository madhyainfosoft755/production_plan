import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {
  roles!: any;
  loadingRoles: boolean = false;

  constructor(
    private adminApiService: AdminApiService
  ){}

  ngOnInit(): void {
    this.load_roles_data();
  }

  load_roles_data(){
    this.loadingRoles = true;
    this.adminApiService.get_all_roles().subscribe({
      next: (res: any)=>{
        this.roles = res.data;
        this.loadingRoles = false;
      }, 
      error: (err: any)=>{
        this.loadingRoles = false;
      }
    });
  }

}
