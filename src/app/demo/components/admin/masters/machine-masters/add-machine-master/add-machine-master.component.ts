import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-add-machine-master',
  templateUrl: './add-machine-master.component.html',
  styleUrl: './add-machine-master.component.scss'
})
export class AddMachineMasterComponent implements OnInit {
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  machineMasterForm: FormGroup;
  submitted = false;
  loading = false;
  loadingModules: boolean = false;
  loadingMachines: boolean = false;
  backendErrors: any = {};
  visibleAddModuleDialog: boolean = false;

  // Dropdown options for Plant and Customer
  machineOptions:any;

  moduleOptions: any;

  constructor(private fb: FormBuilder, private adminApiService: AdminApiService) {
    this.machineMasterForm = this.fb.group({
      machine: ['', Validators.required],
      module: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.load_modules();
    this.load_machines();
  }

  load_modules(){
    this.loadingModules = true;
    this.adminApiService.get_all_modules().subscribe({
      next: (res: any)=>{
        this.moduleOptions = res.data.map(value => ({...value, label: `${value.name} - ${value.responsible}`}));
        this.loadingModules = false;
      }, 
      error: (err: any)=>{
        this.loadingModules = false;

      }
    });
  } 
  load_machines(){
    this.loadingMachines = true;
    this.adminApiService.get_machines_info().subscribe({
      next: (res: any)=>{
        this.machineOptions = res.data.reduce((acc, curr) => {
          // Check if a group for the current machine_name already exists
          let group = acc.find(item => item.label === curr.machine_name);
        
          if (!group) {
            // If not, create a new group
            group = {
              label: curr.machine_name,
              value: curr.machine_id,
              items: [],
            };
            acc.push(group);
          }
        
          // Add the current item to the group's items
          group.items.push({
            label: curr.machine_rev,
            value: curr.rev_id,
          });
        
          return acc;
        }, []);
        this.loadingMachines = false;
      }, 
      error: (err: any)=>{
        this.loadingMachines = false;

      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.machineMasterForm.invalid) {
      return;
    }
    console.log(this.machineMasterForm.value);
    // Prepare FormData
    const formData = new FormData();
    formData.append('module', this.machineMasterForm.controls['module'].value);
    formData.append('machine_rev', this.machineMasterForm.controls['machine'].value);

    this.loading = true;
    this.adminApiService.add_new_machine_master(formData).subscribe({
      next: (res: any)=>{
        // Emit an event with a message or any data
        this.notifyParent.emit(true);
        this.loading = false;
      }, 
      error: (err: HttpErrorResponse)=>{
        console.log(err);
        this.backendErrors = err.error;
        this.loading = false;

      }
    });
  }

  showAddModulesDialog(){
    this.visibleAddModuleDialog = true;
  }

  onModuleNotify(message: boolean): void {
    console.log('Notification from child:', message);
    if(message){
      this.load_modules();
      this.visibleAddModuleDialog = false; // Close the dialog or perform any action
    }
  }
}