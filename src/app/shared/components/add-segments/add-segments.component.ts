import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-add-segments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './add-segments.component.html',
  styleUrl: './add-segments.component.scss'
})
export class AddSegmentsComponent implements OnInit {
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  segmentForm: FormGroup;
  submitted = false;
  loading = false;
  backendErrors: any = {};
  @Input() selectedSegment: any = null;

  ngOnInit(): void {
     if (this.selectedSegment) {
        this.segmentForm.patchValue({
          name: this.selectedSegment.name || ''
        });
      }
  }

  // Transform input to uppercase
  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.segmentForm.controls['name'].setValue(input.value, { emitEvent: false });
  }

  constructor(private fb: FormBuilder, private adminApiService: AdminApiService) {
    this.segmentForm = this.fb.group({
      name: ['', [Validators.required]]
    });
  }


  // Submit form
  onSubmit(): void {
    this.submitted = true;

    if (this.segmentForm.invalid) {
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('name', this.segmentForm.controls['name'].value);

    this.loading = true;
    const apiRef = this.selectedSegment ? this.adminApiService.edit_segments(this.selectedSegment.id, formData) : this.adminApiService.add_segments(formData);
    apiRef.subscribe({
      next: (res)=>{
        this.segmentForm.reset();
        this.loading = false;
        // Emit an event with a message or any data
        this.notifyParent.emit(true);
      }, 
      error: (err: HttpErrorResponse)=>{
        this.backendErrors = err.error.errors;
        this.loading = false;
      }
    });
  }
}
