import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-filter-product-master',
  templateUrl: './filter-product-master.component.html',
  styles: ``
})
export class FilterProductMasterComponent implements OnInit, OnChanges {
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() hideAdvanceFilter: EventEmitter<void> = new EventEmitter<void>();
  @Input() productMasterForm: FormGroup;
  submitted = false;
  loading = true;
  visibleAddFinishDialog: boolean = false;
  visibleAddSegmentDialog: boolean = false;
  visibleAddGroupDialog: boolean = false;
  visibleAddSeg2Dialog: boolean = false;
  visibleAddSeg3Dialog: boolean = false;
  checkingMaterialNumber: boolean = false;
  materialNumberInfo: any;
  material_no_for_process: string = null;
  // Dropdown Options
  machineOptions: any;
  segmentOptions = [];
  loadingFinish: boolean = false;
  loadingSeg2: boolean = false;
  loadingSeg3: boolean = false;
  loadingSegments: boolean = false;
  loadingGroups: boolean = false;
  loadingMachines: boolean = false;
  finishOptions = [];
  seg2Options = [];
  seg3Options = [];
  groupOptions = [];
   // Object to map labels to values
   processMap = {
    Forging: 'J',
    Heating: 'H',
    Finish: 'S'
  };
  @Input() visibleFilterDrawer: boolean = false;
  @Input() enableAdvSearch: boolean = false;
  @Output() formDataChange = new EventEmitter<FormGroup>();
  @Output() clearAdvFilter = new EventEmitter<void>();

  selectedProcess: { label: string; value: string } | null = {label: "Forging", value: 'F'};
  machineModuleOptions: any;
  loadingMachineModules: boolean = false;
  responsible_person: any; 
  @Input() loadingAdvanceFilter = false;

  constructor(private fb: FormBuilder, private adminApiService: AdminApiService) {
    
  }

  ngOnInit(): void {
    this.productMasterForm.valueChanges.subscribe(() => {
      this.formDataChange.emit(this.productMasterForm);
    });
    this.loadInitialData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visibleFilterDrawer']) {
      const current = changes['visibleFilterDrawer'].currentValue;
      const previous = changes['visibleFilterDrawer'].previousValue;
      this.visibleFilterDrawer = current;
    }
    if(changes['enableAdvSearch']){
      const current = changes['enableAdvSearch'].currentValue;
      const previous = changes['enableAdvSearch'].previousValue;
      this.enableAdvSearch = current;
    }
    if(changes['loadingAdvanceFilter']){
      const current = changes['loadingAdvanceFilter'].currentValue;
      const previous = changes['loadingAdvanceFilter'].previousValue;
      this.loadingAdvanceFilter = current;
    }
  }

  loadInitialData(): void {
    this.loading = true;
    this.loadingSeg2 = true;
    this.loadingSeg3 = true;
    this.loadingSegments = true;
    this.loadingGroups = true;
    this.loadingFinish = true;
    this.loadingMachines = true;

    // Make multiple API calls simultaneously
    forkJoin({
      finishData: this.adminApiService.get_all_finish(),
      machinesInfo: this.adminApiService.get_machines_info(),
      seg2Data: this.adminApiService.get_all_seg2(), // Replace with actual API calls
      seg3Data: this.adminApiService.get_all_seg3(),
      segmentsData: this.adminApiService.get_all_segments(),
      groupData: this.adminApiService.get_all_groups()
    }).subscribe({
      next: (res: any) => {
        if(res.finishData){
          this.finishOptions = res.finishData.data;
          this.loadingFinish = false;
        }
        if(res.seg2Data){
          this.seg2Options = res.seg2Data.data;
          this.loadingSeg2 = false;
        }
        if(res.seg3Data){
          this.seg3Options = res.seg3Data.data;
          this.loadingSeg3 = false;
        }
        if(res.segmentsData){
          this.segmentOptions = res.segmentsData.data;
          this.loadingSegments = false;
        }
        if(res.groupData){
          this.groupOptions = res.groupData.data;
          this.loadingGroups = false;
        }

        if(res.machinesInfo){
          this.machineOptions = res.machinesInfo.data.reduce((acc, curr) => {
            let group = acc.find(item => item.label === curr.machine_name);
            if (!group) {
              group = { label: curr.machine_name, value: curr.machine_id, items: [] };
              acc.push(group);
            }
            group.items.push({ label: curr.machine_name, value: curr.machine_id });
            return acc;
          }, []);
          this.loadingMachines = false;
        }

        // Handle other API responses

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  hideAdvanceFilterEmit(){
    this.hideAdvanceFilter.emit();
    // this.productMasterForm.reset();
  }


  load_finish_data(){
    this.loadingFinish = true;
    this.adminApiService.get_all_finish().subscribe({
      next: (res: any)=>{
        this.finishOptions = res.data;
        this.loadingFinish = false;
      }, 
      error: (err: any)=>{
        this.loadingFinish = false;
      }
    });
  }

  load_segment_data(){
    this.loadingSegments = true;
    this.adminApiService.get_all_segments().subscribe({
      next: (res: any)=>{
        this.segmentOptions = res.data;
        this.loadingSegments = false;
      }, 
      error: (err: any)=>{
        this.loadingSegments = false;
      }
    });
  }
  load_group_data(){
    this.loadingGroups = true;
    this.adminApiService.get_all_groups().subscribe({
      next: (res: any)=>{
        this.groupOptions = res.data;
        this.loadingGroups = false;
      }, 
      error: (err: any)=>{
        this.loadingGroups = false;
      }
    });
  }
  load_seg2_data(){
    this.loadingSeg2 = true;
    this.adminApiService.get_all_seg2().subscribe({
      next: (res: any)=>{
        this.seg2Options = res.data;
        this.loadingSeg2 = false;
      }, 
      error: (err: any)=>{
        this.loadingSeg2 = false;
      }
    });
  }

  load_seg3_data(){
    this.loadingSeg3 = true;
    this.adminApiService.get_all_seg3().subscribe({
      next: (res: any)=>{
        this.seg3Options = res.data;
        this.loadingSeg3 = false;
      }, 
      error: (err: any)=>{
        this.loadingSeg3 = false;
      }
    });
  }

  onSubmit(): void {
    this.notifyParent.emit(this.productMasterForm.value);
  }

  get_machines_info(){
    this.loadingMachines = true;
    this.adminApiService.get_machines_info().subscribe({
      next: (res) => {
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
            label: curr.machine_name,
            value: curr.machine_id,
          });
        
          return acc;
        }, []);
        this.loadingMachines = false;
      },
      error: (err) => {
        this.loadingMachines = false;
      }
    });
  }

  showAddFinishDialog(){
    this.visibleAddFinishDialog = true;
  }
  showAddSegmentDialog(){
    this.visibleAddSegmentDialog = true;
  }
  showAddGroupDialog(){
    this.visibleAddGroupDialog = true;
  }
  showAddSeg2Dialog(){
    this.visibleAddSeg2Dialog = true;
  }
  showAddSeg3Dialog(){
    this.visibleAddSeg3Dialog = true;
  }

  onFinishNotify(message: boolean): void {
    if(message){
      this.load_finish_data();
      this.visibleAddFinishDialog = false; // Close the dialog or perform any action
    }
  }

  onSegmentNotify(message: boolean): void {
    if(message){
      this.load_segment_data();
      this.visibleAddSegmentDialog = false; // Close the dialog or perform any action
    }
  }

  onGroupNotify(message: boolean): void {
    if(message){
      this.load_group_data();
      this.visibleAddGroupDialog = false; // Close the dialog or perform any action
    }
  }

  onSeg2Notify(message: boolean): void {
    if(message){
      this.load_seg2_data();
      this.visibleAddSeg2Dialog = false; // Close the dialog or perform any action
    }
  }

  onSeg3Notify(message: boolean): void {
    if(message){
      this.load_seg3_data();
      this.visibleAddSeg3Dialog = false; // Close the dialog or perform any action
    }
  }


  onProcessChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const label = inputElement.value; // Get the label
    const value = this.processMap[label]; // Get the mapped value
    this.selectedProcess = { label, value };
    // this.material_no_for_process = this.productMasterForm.value.material_number.trim()?this.productMasterForm.value.material_number.trim()+value:this.productMasterForm.value.material_number.trim();
    this.material_no_for_process = this.productMasterForm.value.material_number.trim()+value;
  }

  machineChanged(event: any){
    this.loadingMachineModules = true;

    this.adminApiService.getMachineModules(event.value).subscribe({
      next: (res) => {
        this.loadingMachineModules = false;
        this.machineModuleOptions = res.data;
      },
      error: (err) => {
        this.loadingMachineModules = false;
      }
    });
  }

  machineModuleChanged(event: any){
    this.responsible_person = this.machineModuleOptions.filter(val => val.module_id == event.value)[0].responsible;
  }


  clearAdvanceFilter(){
    this.productMasterForm.reset();
    this.clearAdvFilter.emit();
  }


}


// machine options data:
// [
//   {
//     "label": "100T",
//     "value": "3",
//     "items": [
//       {
//         "label": "100T-1",
//         "value": "7"
//       },
//       {
//         "label": "100T-2",
//         "value": "8"
//       }
//     ]
//   }
// ]