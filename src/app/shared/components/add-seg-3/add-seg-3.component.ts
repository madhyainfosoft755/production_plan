import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-add-seg-3',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './add-seg-3.component.html',
  styleUrl: './add-seg-3.component.scss'
})
export class AddSeg3Component implements OnInit {
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  seg3Form: FormGroup;
  submitted = false;
  loading = false;
  backendErrors: any = {};

  ngOnInit(): void {
     
  }

  // Transform input to uppercase
  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.seg3Form.controls['name'].setValue(input.value, { emitEvent: false });
  }

  constructor(private fb: FormBuilder, private adminApiService: AdminApiService) {
    this.seg3Form = this.fb.group({
      name: ['', [Validators.required]]
    });
  }


  // Submit form
  onSubmit(): void {
    this.submitted = true;

    if (this.seg3Form.invalid) {
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('name', this.seg3Form.controls['name'].value);

    this.loading = true;
    this.adminApiService.add_seg3(formData).subscribe({
      next: (res)=>{
        this.seg3Form.reset();
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
