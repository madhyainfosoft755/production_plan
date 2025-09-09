import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-master-templates-password',
  templateUrl: './master-templates-password.component.html',
  styleUrl: './master-templates-password.component.scss'
})
export class MasterTemplatePasswordsComponent implements OnInit {
  loadingPasswords = false;
  passwordRes: any = null;
  templateName = '';
  templates = [
    {
      'label': 'Product Master Template',
      'value': 'PMT' ,
      'loading': false
    },
    {
      'label': 'SAP Data Template',
      'value': 'SAPT',
      'loading': false
    }, 
    {
      'label': 'WorkOrder Master Template',
      'value': 'WOMT',
      'loading': false
    }
  ]

  constructor(
    private adminApiService: AdminApiService
  ){}

  ngOnInit(): void{
    this.load_passwords();
  }

  load_passwords(){
    if(this.templateName.trim()){
      this.loadingPasswords = true;
      this.adminApiService.get_master_template_passwords(this.templateName).subscribe({
        next: (res: any)=>{
          this.passwordRes = res;
          this.loadingPasswords = false;
        }, 
        error: (err: any)=>{
          this.loadingPasswords = false;
        }
      });
    }
  }

  onTemplateNameInput(event: Event): void {
    this.passwordRes = null;
    const input = event.target as HTMLInputElement;
    const filtered = input.value.replace(/[^a-zA-Z0-9_]/g, ''); // only allow a-z, A-Z, 0-9, _
    input.value = filtered;
    this.templateName = filtered;
  }

  release_template(data: any){
    data.loading = true;
    this.adminApiService.release_templage(data.value).subscribe({
      next: (res: any)=>{
        data.loading = false;
      }, 
      error: (err: any)=>{
        data.loading = false;
      }
    });
  }

}
