import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { AuthService } from 'src/app/services/auth.service';
import { UnbrakoPPCommonService } from 'src/app/services/unbrako-pp-common';

@Component({
  selector: 'app-update-main-file',
  templateUrl: './update-main-file.component.html',
  styleUrl: './update-main-file.component.scss'
})
export class UpdateMainFileComponent implements OnInit, OnChanges {
  @Output() notifyParent: EventEmitter<any> = new EventEmitter<any>();
  @Input() data!: any[];
  @Input() STPOptions: any[] = [];
  updateAdminFieldsForm: FormGroup;
  updateRMFieldsForm: FormGroup;
  submitted: boolean = false;
  loadingSubmit: boolean = false;
  maxToForgeQty : number;
  @Input() isRmUser: boolean | null = null;
  loadingFilterSuggestion = false;
  // filteredSuggestions = ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes'];
  filteredSuggestions: string[] = [];
  sap_ids :number[] = [];
  suggestions: {
    monthly_plan: any[] | undefined,
    monthly_fix_plan: any[] | undefined,
    forge_commite_week: any[] | undefined,
    priority_list: any[] | undefined,
    special_remarks: any[] | undefined,
  } = {
    monthly_plan: [],
    monthly_fix_plan: [],
    forge_commite_week: [],
    priority_list: [],
    special_remarks: [],
  }  //: any[] | undefined;

  priorityOptions = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' }
  ];
  loading: boolean = false;
  sapRmData = [];
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private adminApiService: AdminApiService,
    private unbrakoPPCommonService: UnbrakoPPCommonService,
    private authService: AuthService
   ){
    this.updateAdminFieldsForm = this.fb.group({
      monthly_plan: [''],
      monthly_fix_plan: [''],
      forge_commite_week: [''],
      priority_list: [''],
      surface_treatment_process: [''],
      special_remarks: ['']
    });

    this.updateRMFieldsForm = this.fb.group({
      rm_delivery_date: [null],
      rm_delivery: [''],
      rm_correction: [''],
      // plant_allocation: [''],
      // advance_final_rm_wt: [''],
      // rm_allocation_priority: ['']
    });
    
  }

  addToForgeField() {
    if (this.updateAdminFieldsForm.contains('to_forge')) {
      return;
    }
    this.updateAdminFieldsForm.addControl(
      'to_forge',
      this.fb.control('', [
        Validators.min(0),
        Validators.max(this.maxToForgeQty)
      ])
    );
  }

  addRMDateField() {
    if (this.updateRMFieldsForm.contains('rm_date') || this.today.getDay() === 6) {
      return;
    }
    this.updateRMFieldsForm.addControl(
      'rm_date',
      this.fb.control('', [
        Validators.min(0),
      ])
    );
  }

  checkNumberInput(controlName: string) {
    const control = this.updateAdminFieldsForm.get(controlName);
    const value = control?.value;
    if (value !== null && value !== undefined) {
      const numericValue = value.toString().replace(/[^0-9]/g, '');
      control?.setValue(numericValue, { emitEvent: false });
    }
  }

  checkNumberInput1(controlName: string) {
    const control = this.updateRMFieldsForm.get(controlName);
    const value = control?.value;
    if (value !== null && value !== undefined) {
      const numericValue = value.toString().replace(/[^0-9]/g, '');
      control?.setValue(numericValue, { emitEvent: false });
    }
  }

  filterSuggestions(controlName: string, event: any){
    console.log(event);
    const query = event.query.toLowerCase();
    this.filteredSuggestions = this.suggestions[controlName].filter(item =>
      item.toLowerCase().includes(query)
    );
  }

  removeToForgeField() {
    if (this.updateAdminFieldsForm.contains('to_forge')) {
      this.updateAdminFieldsForm.removeControl('to_forge');
    }
  }

  removeRMDateField() {
    if (this.updateRMFieldsForm.contains('rm_date')) {
      this.updateRMFieldsForm.removeControl('rm_date');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.data = changes['data'].currentValue;
      this.sap_ids = this.data.map(val => Number(val.sap_id));
      if(this.data.length === 1){
        this.maxToForgeQty = Math.floor((+this.data[0].final_pending_qty * 0.1))
        console.log('Data changed from:', changes['data'].previousValue, 'to:', changes['data'].currentValue);
        this.addToForgeField();
        if(this.isRmUser){
          this.addRMDateField();
          this.loadSapRmData();
        }
      } else {
        this.removeRMDateField();
        this.removeToForgeField();
      }
    }
    if(changes['STPOptions']){
      this.STPOptions = changes['STPOptions'].currentValue;
    }
  }

  loadSapRmData(){
    this.adminApiService.get_sap_rm_data(this.data[0].sap_id).subscribe({
      next: (res: any)=>{
        this.sapRmData = res.data;
      }, 
      error: (err: any)=>{
        console.log(err);
      }
    });
  }

  ngOnInit(): void{
    this.loadFIlterSuggestions();
  }

  loadFIlterSuggestions(){
    this.loadingFilterSuggestion = true;
    this.adminApiService.loadSAPFilterSuggestions().subscribe({
      next: (res: any)=>{
        this.suggestions = {
          monthly_plan: res.monthly_plan && res.monthly_plan.length > 0 ? res.monthly_plan : [],
          monthly_fix_plan: res.monthly_fix_plan && res.monthly_fix_plan.length > 0 ? res.monthly_fix_plan : [],
          forge_commite_week: res.forge_commite_week && res.forge_commite_week.length > 0 ? res.forge_commite_week : [],
          priority_list: res.priority_list && res.priority_list.length > 0 ? res.priority_list : [],
          special_remarks: res.special_remarks && res.special_remarks.length > 0 ? res.special_remarks : [],
        }
        console.log(this.filteredSuggestions)
        this.loadingFilterSuggestion = false;
      }, 
      error: (err: any)=>{
        console.log(err);
        this.loadingFilterSuggestion = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.updateAdminFieldsForm.valid && !this.isRmUser) {
      console.log('Form Submitted:', this.updateAdminFieldsForm.value);
      // Perform further operations like API calls here
      this.loadingSubmit = true;
      this.adminApiService.update_buld_admin_fields({sap_ids: this.sap_ids, ...this.updateAdminFieldsForm.value}).subscribe({
        next: (res: any)=>{
          this.notifyParent.emit(res);
          this.loadingSubmit = false;
        }, 
        error: (err: any)=>{
          console.log(err);
          this.loadingSubmit = false;
        }
      });
    }
  }

  onSubmitRMForm(){
    this.loadingSubmit = true;
    if (this.updateRMFieldsForm.valid && this.isRmUser) {
      console.log('Form Submitted:', this.updateRMFieldsForm.value);
      // Perform further operations like API calls here
      
      this.adminApiService.update_sap_rm_data({sap_ids: this.sap_ids, ...this.updateRMFieldsForm.value}).subscribe({
        next: (res: any)=>{       
          this.notifyParent.emit(res);   
          this.loadingSubmit = false;
        }, 
        error: (err: any)=>{
          console.log(err);          
          this.loadingSubmit = false;
        }
      });
    }
  }


}
