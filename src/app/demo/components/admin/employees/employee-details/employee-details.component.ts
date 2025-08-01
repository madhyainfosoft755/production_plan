import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss'
})
export class EmployeeDetailsComponent implements OnInit, OnChanges {
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() employee: any;
  employeeForm: FormGroup;
  submitted = false;
  loading = false;

  // Role Dropdown Options
  roleOptions = [
    { label: this.constantService.ADMIN, value: this.constantService.ADMIN },
    { label: this.constantService.FORGING, value: this.constantService.FORGING },
    { label: this.constantService.HEATING, value: this.constantService.HEATING },
    { label: this.constantService.FINISH, value: this.constantService.FINISH },
    { label: this.constantService.RM, value: this.constantService.RM }
  ];

  // Dropdown Options
  salutationOptions = [
    { label: 'Mr.', value: 'Mr.' },
    { label: 'Mrs.', value: 'Mrs.' },
    { label: 'Ms.', value: 'Ms.' },
    { label: 'Dr.', value: 'Dr.' },
    { label: 'Prof.', value: 'Prof.' }
  ];

  constructor(private fb: FormBuilder, private adminApiService: AdminApiService, private constantService: ConstantService) {
    this.employeeForm = this.fb.group(
      {
        salutation: ['Mr.', Validators.required],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        emp_id: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', Validators.required],
        role: ['', Validators.required]
      }
    );
  }

  togglePasswordRequired(isRequired: boolean): void {
    const passwordControl = this.employeeForm.get('password');
    const confirmControl = this.employeeForm.get('confirm_password');

    if (!passwordControl || !confirmControl) return;

    if (isRequired) {
      passwordControl.setValidators([Validators.required, Validators.minLength(6)]);
      confirmControl.setValidators([Validators.required]);
    } else {
      passwordControl.setValidators([Validators.minLength(6)]); // Remove 'required'
      confirmControl.clearValidators(); // Remove all validators
    }

    passwordControl.updateValueAndValidity();
    confirmControl.updateValueAndValidity();
  }


  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee']) {
      this.employee = changes['employee'].currentValue;
      if(this.employee){
        this.addActiveField();
        this.employeeForm.patchValue({
          salutation: this.employee?.salutation || '',
          name: this.employee?.name || '',
          email: this.employee?.email_add || '',
          emp_id: this.employee?.emp_id || '',
          role: this.employee?.role || '',
          active: Number(this.employee?.active || 0)
        });
      } else {
        this.removeActiveField();
      }
    }
  }

  addActiveField() {
    if (this.employeeForm.contains('active')) {
      return;
    }
    this.employeeForm.addControl(
      'active',
      this.fb.control(true, [
        Validators.required,
      ])
    );
    if (this.employeeForm.contains('password')) {
      this.employeeForm.removeControl('password');
      this.employeeForm.removeControl('confirm_password');
    }
  }
  removeActiveField() {
    if (this.employeeForm.contains('active')) {
      this.employeeForm.removeControl('active');
    }
    if (this.employeeForm.contains('password')) {
      return;
    }
    this.employeeForm.addControl(
      'password',
      this.fb.control(true, [
        Validators.required, Validators.minLength(6)
      ])
    );
    this.employeeForm.addControl(
      'confirm_password',
      this.fb.control(true, [
        Validators.required
      ])
    );
    this.employeeForm.setValidators(this.matchPasswords);
    this.employeeForm.updateValueAndValidity();
  }

  // Validator to match passwords
  matchPasswords() {
    return (formGroup: FormGroup) => {
      if (this.employeeForm.contains('password') && this.employeeForm.contains('confirm_password')) {
        const passwordControl = formGroup.controls['password'];
        const confirmPasswordControl = formGroup.controls['confirm_password'];
  
        if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mismatch']) {
          return;
        }
  
        if (passwordControl.value !== confirmPasswordControl.value) {
          confirmPasswordControl.setErrors({ mismatch: true });
        } else {
          confirmPasswordControl.setErrors(null);
        }
      }
    };
  }

  // Submit Form
  onSubmit(): void {
    this.submitted = true;
    console.log(this.employeeForm)
    console.log(this.employeeForm.invalid)
    if (this.employeeForm.invalid) {
      return;
    }

    this.loading = true;

    if(this.employee){
      this.adminApiService.updateUserByAmin(this.employee.id, this.employeeForm.value).subscribe({
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
    } else {
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
}