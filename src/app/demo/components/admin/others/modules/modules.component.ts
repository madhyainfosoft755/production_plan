import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.scss'
})
export class ModulesComponent implements OnInit {
  modulesData!: any;
  loadingModules: boolean = false;
  visibleAddModuleDialog: boolean = false;

  constructor(
    private adminApiService: AdminApiService
  ){}

  ngOnInit(): void {
    this.load_modules_data();
  }

  load_modules_data(){
    this.loadingModules = true;
    this.adminApiService.get_all_modules().subscribe({
      next: (res: any)=>{
        this.modulesData = res.data;
        this.loadingModules = false;
      }, 
      error: (err: any)=>{
        this.loadingModules = false;
      }
    });
  }

  showAddModuleDialog(){
    this.visibleAddModuleDialog = true;
  }

  onChildNotify(message: boolean): void {
    console.log('Notification from child:', message);
    if(message){
      this.load_modules_data();
      this.visibleAddModuleDialog = false; // Close the dialog or perform any action
    }
  }
}
