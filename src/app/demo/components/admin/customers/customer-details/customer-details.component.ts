import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.scss'
})
export class CustomerDetailsComponent {
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  customerForm: FormGroup;
  submitted = false;
  loading = false;

  ngOnInit(): void {
     
  }
  constructor(private fb: FormBuilder, private adminApiService: AdminApiService) {
    this.customerForm = this.fb.group({
      customerName: ['', [Validators.required]],
      description: [null]
    });
  }


  // Submit form
  onSubmit(): void {
    this.submitted = true;

    if (this.customerForm.invalid) {
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('name', this.customerForm.controls['customerName'].value);
    formData.append('description', this.customerForm.controls['description'].value);

    this.loading = true;
    this.adminApiService.add_customer(formData).subscribe({
      next: (res)=>{
        this.loading = false;
        // Emit an event with a message or any data
        this.notifyParent.emit(true);
      }, 
      error: (err)=>{
        this.loading = false;
      }
    });
  }
}
