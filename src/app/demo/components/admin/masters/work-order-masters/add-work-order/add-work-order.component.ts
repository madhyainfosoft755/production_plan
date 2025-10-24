import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { debounceTime, Subject } from 'rxjs';
import { CommonUtilsService } from 'src/app/services/common-utils.service';

@Component({
  selector: 'app-add-work-order',
  templateUrl: './add-work-order.component.html',
  styleUrl: './add-work-order.component.scss'
})
export class AddWorkOrderComponent implements OnInit {
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  workOrderForm: FormGroup;
  submitted = false;
  loading = false;
  loadingSegment: boolean = false;
  loadingPlant: boolean = false;
  loadingResponsible: boolean = false;
  loadingMarketing: boolean = false;
  loadingCustomers: boolean = false;
  suggestions: any[] | undefined;
  private inputSubject = new Subject<string>();
  @Input() selectedWO: any = null;

  // Dropdown options for Plant and Customer
  plantOptions:any;

  segmentOptions: any;
  marketingPersonOptions: any;
  responsiblePersonOptions: any;

  constructor(private fb: FormBuilder, private adminApiService: AdminApiService, private commonUtilsService: CommonUtilsService) {
    this.workOrderForm = this.fb.group({
      plant: ['MP01', Validators.required],
      customer: ['', Validators.required],
      segment: ['', Validators.required],
      marketing_person_name: ['', Validators.required],
      responsible_person_name: ['', Validators.required],
      reciving_date: ['', Validators.required],
      delivery_date: ['', Validators.required],
      wo_add_date: ['', Validators.required],
      work_order_db: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(6)]
      ],
      quality_inspection_required: [0], // Default value is 0 (Off)
      no_of_items: ['', Validators.required],
      weight: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Subscribe to input changes with debounce
    // this.inputSubject.pipe(debounceTime(2000)).subscribe((value) => {
    //   this.fetchSuggestions(value);
    // });
    if(this.selectedWO){
      this.workOrderForm.patchValue({
        plant: this.selectedWO.plant ,
        customer: this.selectedWO.customer ,
        segment: this.selectedWO.segment ,
        marketing_person_name: this.selectedWO.marketing_person_name1 ,
        responsible_person_name: this.selectedWO.responsible_person_name1 ,
        reciving_date: this.selectedWO.reciving_date ? new Date(this.selectedWO.reciving_date) : null ,
        delivery_date: this.selectedWO.delivery_date ? new Date(this.selectedWO.delivery_date) : null ,
        wo_add_date: this.selectedWO.wo_add_date ? new Date(this.selectedWO.wo_add_date) : null ,
        work_order_db: this.selectedWO.work_order_db ,
        quality_inspection_required: Number(this.selectedWO.quality_inspection_required ?? 0) ,
        no_of_items: this.selectedWO.no_of_items ,
        weight: this.selectedWO.weight ,
      });
    }
    this.load_segments();
    this.load_responsible();
    this.load_marketing();
    // this.load_plant();
  }

  load_segments(){
    this.loadingSegment = true;
    this.adminApiService.get_all_segments().subscribe({
      next: (res: any)=>{
        this.responsiblePersonOptions = res.data;
        this.loadingSegment = false;
      }, 
      error: (err: any)=>{
        this.loadingSegment = false;

      }
    });
  } 

  load_responsible(){
    this.loadingResponsible = true;
    this.adminApiService.get_all_segments().subscribe({
      next: (res: any)=>{
        this.segmentOptions = res.data;
        this.loadingResponsible = false;
      }, 
      error: (err: any)=>{
        this.loadingResponsible = false;

      }
    });
  } 


  load_marketing(){
    this.loadingMarketing = true;
    this.adminApiService.get_all_segments().subscribe({
      next: (res: any)=>{
        this.marketingPersonOptions = res.data;
        this.loadingMarketing = false;
      }, 
      error: (err: any)=>{
        this.loadingMarketing = false;

      }
    });
  } 

  search(event: any) {
    this.load_customers(event.query);
  }


  load_customers(query: string){
    this.loadingCustomers = true;
    this.adminApiService.get_all_customer_names(query).subscribe({
      next: (res: any)=>{
        this.loadingCustomers = false;
        this.suggestions = res.data.map(item => item.customer);
      }, 
      error: (err: any)=>{
        this.loadingCustomers = false;

      }
    });
  } 


  // load_plant(){
  //   this.loadingPlant = true;
  //   this.adminApiService.get_all_plant().subscribe({
  //     next: (res: any)=>{
  //       this.plantOptions = res.data;
  //       this.workOrderForm.patchValue({
  //         plant: '1' // Default value is 'B'
  //       });
  //       this.loadingPlant = false;
  //     }, 
  //     error: (err: any)=>{
  //       this.loadingPlant = false;

  //     }
  //   });
  // }

  onSubmit(): void {
    this.submitted = true;
    if (this.workOrderForm.invalid) {
      this.workOrderForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const data: any = {
      ...this.workOrderForm.value,
      reciving_date: this.commonUtilsService.getFormatedDate(this.workOrderForm.value.reciving_date),
      delivery_date: this.commonUtilsService.getFormatedDate(this.workOrderForm.value.delivery_date),
      wo_add_date: this.commonUtilsService.getFormatedDate(this.workOrderForm.value.wo_add_date),
    }
    if(this.selectedWO){
      this.adminApiService.update_work_order(this.selectedWO.id, data).subscribe({
        next: (res: any)=>{
          // this.segmentOptions = res.data;
          // Emit an event with a message or any data
          this.notifyParent.emit(true);
          this.loading = false;
        }, 
        error: (err: any)=>{
          this.loading = false;
  
        }
      });
    } else {

      this.adminApiService.add_new_work_order(data).subscribe({
        next: (res: any)=>{
          // this.segmentOptions = res.data;
          // Emit an event with a message or any data
          this.notifyParent.emit(true);
          this.loading = false;
        }, 
        error: (err: any)=>{
          this.loading = false;
  
        }
      });
    }
  }

  // onInput(value: string): void {
  //   if (value.trim()) {
  //     this.inputSubject.next(value);
  //   } else {
  //     this.suggestions = ['abc'];
  //   }
  // }

  // fetchSuggestions(query: string): void {
  //   // Simulate API call with a delay
  //   // Replace this with your actual API service
  //   this.load_customers(query);
  //   // const mockApiData = customers;
  //   // this.suggestions = customers;
  //   // this.suggestions = mockApiData.filter((name) =>
  //   //   name.toLowerCase().includes(query.toLowerCase())
  //   // );
  // }

  // selectCustomer(name: string): void {
  //   this.workOrderForm.get('customer')?.setValue(name);
  //   this.suggestions = []; // Clear suggestions after selection
  // }
}