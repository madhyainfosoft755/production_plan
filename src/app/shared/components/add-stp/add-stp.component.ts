import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-add-stp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './add-stp.component.html',
  styleUrl: './add-stp.component.scss'
})
export class AddSTPComponent implements OnInit {
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  stpForm: FormGroup;
  submitted = false;
  loading = false;
  backendErrors: any = {};
  @Input() selectedSTP: any = null;

  ngOnInit(): void {
      if (this.selectedSTP) {
        this.stpForm.patchValue({
          name: this.selectedSTP.name || ''
        });
      }
  }

  // Transform input to uppercase
  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.stpForm.controls['name'].setValue(input.value, { emitEvent: false });
  }

  constructor(private fb: FormBuilder, private adminApiService: AdminApiService) {
    this.stpForm = this.fb.group({
      name: ['', [Validators.required]]
    });
  }


  // Submit form
  onSubmit(): void {
    this.submitted = true;

    if (this.stpForm.invalid) {
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('name', this.stpForm.controls['name'].value);

    this.loading = true;
    const apiRef = this.selectedSTP ? this.adminApiService.edit_surface_treatment_process(this.selectedSTP.id, formData) : this.adminApiService.add_surface_treatment_process(formData);
    apiRef.subscribe({
      next: (res)=>{
        this.stpForm.reset();
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
