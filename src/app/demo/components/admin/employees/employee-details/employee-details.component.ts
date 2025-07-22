import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss'
})
export class EmployeeDetailsComponent implements OnInit {
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  employeeForm: FormGroup;
  submitted = false;
  loading = false;

  // Role Dropdown Options
  roleOptions = [
    { label: 'Admin', value: 1 },
    { label: 'Forging', value: 2 },
    { label: 'Heating', value: 3 },
    { label: 'Finish', value: 4 },
    { label: 'RM', value: 5 }
  ];

  // Dropdown Options
  salutationOptions = [
    { label: 'Mr.', value: 'Mr.' },
    { label: 'Mrs.', value: 'Mrs.' },
    { label: 'Ms.', value: 'Ms.' },
    { label: 'Dr.', value: 'Dr.' },
    { label: 'Prof.', value: 'Prof.' }
  ];

  constructor(private fb: FormBuilder, private adminApiService: AdminApiService) {
    this.employeeForm = this.fb.group(
      {
        salutation: ['Mr.', Validators.required],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        emp_id: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', Validators.required],
        role: ['', Validators.required]
      },
      {
        validators: this.matchPasswords('password', 'confirm_password')
      }
    );
  }

  ngOnInit(): void {}

  // Validator to match passwords
  matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mismatch']) {
        return;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  // Submit Form
  onSubmit(): void {
    this.submitted = true;

    if (this.employeeForm.invalid) {
      return;
    }

    this.loading = true;

    this.adminApiService.register(this.employeeForm.value).subscribe({
      next: (res)=>{
        this.loading = false;
        // Emit an event with a message or any data
        this.notifyParent.emit(true);
      }, 
      error: (err)=>{
        this.loading = false;
        console.log(err);
      }
    });
  }
}