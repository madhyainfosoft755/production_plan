import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent implements OnInit {
  groupsData!: any;
  loadingGroups: boolean = false;
  visibleAddGroupDialog: boolean = false;

  constructor(
    private adminApiService: AdminApiService
  ){}

  ngOnInit(): void {
    this.load_groups_data();
  }

  load_groups_data(){
    this.loadingGroups = true;
    this.adminApiService.get_all_groups().subscribe({
      next: (res: any)=>{
        this.groupsData = res.data;
        this.loadingGroups = false;
      }, 
      error: (err: any)=>{
        this.loadingGroups = false;
      }
    });
  }

  showAddGroupDialog(){
    this.visibleAddGroupDialog = true;
  }

  onChildNotify(message: boolean): void {
    console.log('Notification from child:', message);
    if(message){
      this.load_groups_data();
      this.visibleAddGroupDialog = false; // Close the dialog or perform any action
    }
  }
}
