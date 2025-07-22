import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-add-seg-2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './add-seg-2.component.html',
  styleUrl: './add-seg-2.component.scss'
})
export class AddSeg2Component implements OnInit {
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  seg2Form: FormGroup;
  submitted = false;
  loading = false;
  backendErrors: any = {};

  ngOnInit(): void {
     
  }

  // Transform input to uppercase
  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.seg2Form.controls['name'].setValue(input.value, { emitEvent: false });
  }

  constructor(private fb: FormBuilder, private adminApiService: AdminApiService) {
    this.seg2Form = this.fb.group({
      name: ['', [Validators.required]]
    });
  }


  // Submit form
  onSubmit(): void {
    this.submitted = true;

    if (this.seg2Form.invalid) {
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('name', this.seg2Form.controls['name'].value);

    this.loading = true;
    this.adminApiService.add_seg2(formData).subscribe({
      next: (res)=>{
        this.seg2Form.reset();
        this.loading = false;
        // Emit an event with a message or any data
        this.notifyParent.emit(true);
      }, 
      error: (err: HttpErrorResponse)=>{
        this.backendErrors = err.error.errors;
        this.loading = false;
        console.log(err);
      }
    });
  }
}
