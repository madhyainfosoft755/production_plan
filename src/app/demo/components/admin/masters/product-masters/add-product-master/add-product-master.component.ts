import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-product-master',
  templateUrl: './add-product-master.component.html',
  styleUrl: './add-product-master.component.scss'
})
export class AddProductMasterComponent implements OnInit {
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  productMasterForm: FormGroup;
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
  @Input() selectedProductNumber: any = null;

  selectedProcess: { label: string; value: string } | null = {label: "Forging", value: 'F'};
  machineModuleOptions: any;
  loadingMachineModules: boolean = false;
  responsible_person: any; 

  constructor(private fb: FormBuilder, private adminApiService: AdminApiService) {
    this.productMasterForm = this.fb.group({
      order_number: ['', Validators.required],
      material_number: ['', Validators.required],
      material_description: ['', Validators.required],
      unit_of_measure: ['', Validators.required],
      machine: ['', Validators.required],
      machine_module: ['', Validators.required],
      segment: [null],
      cheese_wt: [null],
      finish: [null],
      finish_wt: [null],
      size: [null],
      length: [null],
      spec: [null],
      rod_dia1: [null],
      drawn_dia1: [null],
      condition_of_rm: [null],
      prod_group: [null],
      seg2: [null],
      seg3: [null],
      special_remarks: [null],
      bom: [null],
      rm_component: [null],
    });
  }

  ngOnInit(): void {
    // React to value changes
    this.productMasterForm.get('material_number')?.valueChanges.subscribe(value => {
      this.onInput(value);
      // Put your old onInput() logic here
    });
    if(this.selectedProductNumber){
      // this.onInput(this.selectedProductNumber.material_number);
      this.productMasterForm.patchValue({
        order_number: this.selectedProductNumber.order_number,
        material_number: this.selectedProductNumber.material_number,
      });
    }
    this.loadInitialData();
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
    this.submitted = true;

    if (this.productMasterForm.invalid) {
      return;
    }

    this.loading = true;
    if(this.selectedProductNumber){
      this.adminApiService.updateProductMaster(this.selectedProductNumber.id, {...this.productMasterForm.value, material_number_for_process:this.material_no_for_process}).subscribe({
        next: (res) => {
          this.loading = false;
          // Emit an event with a message or any data
          this.notifyParent.emit(true);
        },
        error: (err) => {
          this.loading = false;
        }
      });
    } else {
      this.adminApiService.addProductMaster({...this.productMasterForm.value, material_number_for_process:this.material_no_for_process}).subscribe({
        next: (res) => {
          this.loading = false;
          // Emit an event with a message or any data
          this.notifyParent.emit(true);
        },
        error: (err) => {
          this.loading = false;
        }
      });
    }
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

  onInput(value: string): void {
    if (value.trim()) {
      this.material_no_for_process = value.trim()+this.processMap[this.selectedProcess['label']];
      this.checkingMaterialNumber = true;
      this.adminApiService.get_material_no_info(value.trim()).subscribe({
        next: (res: any)=>{
          this.materialNumberInfo = res.data;
          this.productMasterForm.patchValue({
            material_description: res.data.material_description,
            unit_of_measure: res.data.unit_of_measure,
            machine: res.data.machine,
            machine_module: res.data.machine_module,
            segment: res.data.segment,
            cheese_wt: res.data.cheese_wt,
            finish: res.data.finish,
            finish_wt: res.data.finish_wt,
            size: res.data.size,
            length: res.data.length,
            spec: res.data.spec,
            rod_dia1: res.data.rod_dia1,
            drawn_dia1: res.data.drawn_dia1,
            condition_of_rm: res.data.condition_of_rm,
            prod_group: res.data.prod_group,
            seg2: res.data.seg3,
            seg3: res.data.seg3,
            special_remarks: res.data.special_remarks,
            bom: res.data.bom,
            rm_component: res.data.rm_component,
          });
          this.checkingMaterialNumber = false;
          this.machineChanged({value: res.data.machine});
        }, 
        error: (err: any)=>{
          this.checkingMaterialNumber = false;
          this.productMasterForm.patchValue({
            material_description: '',
            unit_of_measure: '',
            machine: '',
            machine_module: '',
            segment: null,
            cheese_wt: null,
            finish: null,
            finish_wt: null,
            size: null,
            length: null,
            spec: null,
            rod_dia1: null,
            drawn_dia1: null,
            condition_of_rm: null,
            prod_group: null,
            seg2: null,
            seg3: null,
            special_remarks: null,
            bom: null,
            rm_component: null,
          });
          this.materialNumberInfo = undefined;
        }
      });
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