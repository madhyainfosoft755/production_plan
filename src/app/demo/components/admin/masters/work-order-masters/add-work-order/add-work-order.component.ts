import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { debounceTime, Subject } from 'rxjs';

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

  // Dropdown options for Plant and Customer
  plantOptions:any;

  segmentOptions: any;
  marketingPersonOptions: any;
  responsiblePersonOptions: any;

  constructor(private fb: FormBuilder, private adminApiService: AdminApiService) {
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
    console.log(this.workOrderForm.value);
    if (this.workOrderForm.invalid) {
      return;
    }

    this.loading = true;
    this.adminApiService.add_new_work_order(this.workOrderForm.value).subscribe({
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
  //   console.log(this.suggestions);
  //   // this.suggestions = mockApiData.filter((name) =>
  //   //   name.toLowerCase().includes(query.toLowerCase())
  //   // );
  // }

  // selectCustomer(name: string): void {
  //   this.workOrderForm.get('customer')?.setValue(name);
  //   this.suggestions = []; // Clear suggestions after selection
  // }
}