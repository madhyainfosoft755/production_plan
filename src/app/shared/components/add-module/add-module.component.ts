import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { AdminApiService } from 'src/app/services/adminapi.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-module',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, ProgressSpinnerModule, DropdownModule, InputTextModule],
  templateUrl: './add-module.component.html',
  styleUrl: './add-module.component.scss'
})
export class AddModuleComponent implements OnInit {
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  moduleForm: FormGroup;
  submitted = false;
  loading = false;
  backendErrors: any = {};
  responsibleOptions: any;
  loadingResponsibles: boolean = false;

  ngOnInit(): void {
    this.load_customers();
  }

  load_customers(){
    this.loadingResponsibles = true;
    this.adminApiService.get_all_employees().subscribe({
      next: (res: any)=>{
        this.responsibleOptions = res.data.map(value => ({...value, label: `${value.name} - ${value.role.toLowerCase()}`}));
        this.loadingResponsibles = false;
      }, 
      error: (err: any)=>{
        this.loadingResponsibles = false;

      }
    });
  } 

  // Transform input to uppercase
  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.moduleForm.controls['name'].setValue(input.value, { emitEvent: false });
  }

  constructor(private fb: FormBuilder, private adminApiService: AdminApiService, private authService: AuthService) {
    this.moduleForm = this.fb.group({
      name: ['', [Validators.required]],
      responsible: ['', Validators.required],
    });
  }

  // Submit form
  onSubmit(): void {
    this.submitted = true;

    if (this.moduleForm.invalid) {
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('name', this.moduleForm.controls['name'].value);
    formData.append('responsible', this.moduleForm.controls['responsible'].value);

    this.loading = true;
    this.adminApiService.add_modules(formData).subscribe({
      next: (res)=>{
        this.moduleForm.reset();
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
