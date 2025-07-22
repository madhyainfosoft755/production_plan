import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-master-templates-password',
  templateUrl: './master-templates-password.component.html',
  styleUrl: './master-templates-password.component.scss'
})
export class MasterTemplatePasswordsComponent implements OnInit {
  loadingPasswords: boolean = false;
  data: any[] = [];

  constructor(
    private adminApiService: AdminApiService
  ){}

  ngOnInit(): void{
    this.load_passwords();
  }

  load_passwords(){
    this.loadingPasswords = true;
    this.adminApiService.get_master_template_passwords().subscribe({
      next: (res: any)=>{
        this.data = res.data;
        this.loadingPasswords = false;
      }, 
      error: (err: any)=>{
        this.loadingPasswords = false;
      }
    });
  }

}
