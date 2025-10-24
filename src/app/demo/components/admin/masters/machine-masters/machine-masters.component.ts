import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PageEvent } from 'src/app/models/common-models';

import { AdminApiService } from 'src/app/services/adminapi.service';
import { CommonUtilsService } from 'src/app/services/common-utils.service';

@Component({
  selector: 'app-machine-masters',
  templateUrl: './machine-masters.component.html',
  styleUrl: './machine-masters.component.scss'
})
export class MachineMastersComponent implements OnInit, OnDestroy {
  visibleAddMMDialog: boolean = false;
  machineMaster!: {
    id: number, 
    process: string, 
    product: string|null, 
    machine: string, 
    responsible: string,
    module: string,
    no_of_mc: number|null,
    speed: number|null,
    no_of_shift: number|null
  }[];
  loadingMMD: boolean = false;
  breadcrumbItems: any[];

  subscriptions: Subscription[] = [];
  machines: any[] = [];
  machine_rev: any[] = [];
  modules: any[] = [];

  machinesFilterForm: FormGroup;
  loadingAdvanceFilter = false;
  enableAdvSearch = false;
  initialAdvSearchValues;
  visibleFilterDrawer = false;
  loadingModules = false;
  loadingMachines = false;
  pagination: {
    current_page: string,
    per_page: string,
    total: string,
    last_page: string
  };

  constructor(
    private adminApiService: AdminApiService, 
    private fb: FormBuilder,
    private commonUtilsService: CommonUtilsService
  ) {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'Machine Master'}
    ];
    this.machinesFilterForm = this.fb.group({
      machines: [null],
      modules: [null]
    });
    this.initialAdvSearchValues = this.machinesFilterForm.value;
  }

  ngOnInit(): void {
    const advanceSearchFormSub = this.machinesFilterForm.valueChanges.subscribe(currentValue  => {
      this.enableAdvSearch = JSON.stringify(this.commonUtilsService.replaceNullsWithEmpty(currentValue)) !== JSON.stringify(this.commonUtilsService.replaceNullsWithEmpty(this.initialAdvSearchValues));
    });
    this.subscriptions.push(advanceSearchFormSub);
    this.loadData();
    this.load_modules();
    this.load_machines();
  }

  loadData(page=1){
    this.loadingMMD = true;
    if(this.enableAdvSearch){
      this.loadingAdvanceFilter = true;
    }
    this.adminApiService.get_machine_master(this.machinesFilterForm.value, page).subscribe({
      next: (res: any)=>{
        this.machineMaster = res.data;
        this.pagination = res.pagination;
        if(this.enableAdvSearch){
          this.visibleFilterDrawer = false;
        }
        this.loadingMMD = false;
        this.loadingAdvanceFilter = false;
      }, 
      error: (err: any)=>{
        this.loadingMMD = false;
        this.loadingAdvanceFilter = false;

      }
    });
  }

  load_modules(){
    this.loadingModules = true;
    this.adminApiService.get_all_modules().subscribe({
      next: (res: any)=>{
        this.modules = res.data.map(value => ({...value, label: `${value.name} - ${value.responsible}`}));
        this.loadingModules = false;
      }, 
      error: (err: any)=>{
        this.loadingModules = false;

      }
    });
  } 

  load_machines(){
    this.loadingMachines = true;
    this.adminApiService.get_machines().subscribe({
      next: (res: any)=>{
        this.machines = res.data;
        this.loadingMachines = false;
      }, 
      error: (err: any)=>{
        this.loadingMachines = false;

      }
    });
  } 

  showAddMMDialog(){
    this.visibleAddMMDialog = true;
  }

  onChildNotify(message: boolean): void {
    if(message){
      this.loadData();
      this.visibleAddMMDialog = false; // Close the dialog or perform any action
    }
  }

  onPageChange(event: PageEvent) {
    this.loadData(Number(event.page)+1);
  }

  clearAdvanceFilter(){
    this.machinesFilterForm.reset();
    this.loadData();
  }

  onSubmitFilter(){
    this.loadData();
  }

  showFilterDrawer(){
    this.visibleFilterDrawer = true;
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
