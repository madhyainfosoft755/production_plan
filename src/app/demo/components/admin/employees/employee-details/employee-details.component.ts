import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  @Input() permissions: {id: number, code: string, description: string}[] | null = null;
  employeeForm: FormGroup;
  submitted = false;
  loading = false;
  empPermissions: string[] = [];

  // Permissions that should be disabled (based on role)
  disabledPermissions: string[] = [];
  // In employee-details.component.ts
  // private _incommingUserPermission: string[] = [];
  @Input() readonly incommingUserPermission: string[] | null = null;
  // @Input()  set incommingUserPermission(value: string[] | null) {
  //   // Only set it once if it's not already set
  //   if (!this._incommingUserPermission.length && value?.length) {
  //     this._incommingUserPermission = [...value]; // Make a copy
  //   }
  // }

  // get incommingUserPermission(): string[] {
  //   return this._incommingUserPermission;
  // }

  // Role Dropdown Options
  roleOptions = [
    { label: this.constantService.ADMIN, value: this.constantService.ADMIN },
    { label: this.constantService.USER, value: this.constantService.USER },
    { label: this.constantService.PLANNER, value: this.constantService.PLANNER },
    { label: this.constantService.MASTER, value: this.constantService.MASTER },
    { label: this.constantService.VIEWER, value: this.constantService.VIEWER }
  ];

  // Dropdown Options
  salutationOptions = [
    { label: 'Mr.', value: 'Mr.' },
    { label: 'Mrs.', value: 'Mrs.' },
    { label: 'Ms.', value: 'Ms.' },
    { label: 'Dr.', value: 'Dr.' },
    { label: 'Prof.', value: 'Prof.' }
  ];

  onRoleChange(role: string) {
    // Set selected permissions (array of permission IDs)
    this.empPermissions = [];
    if(role && role === this.employee?.role){
      this.empPermissions = structuredClone(this.incommingUserPermission || []);
    }

    // Example: disable certain permission IDs for specific roles
    const roleBasedDisabled = {
      PLANNER: ['FullControlOnMainFile', 'ManageWeeklyPlanning'], // disable permission IDs 1 and 2 for PLANNER
      USER: ['AddDailyUpdates'],
      VIEWER: ['AllReports'],
      MASTER: ['UploadSAPFile','FullControlOnMasters', 'ViewLogs'],
      ADMIN: ['UploadSAPFile','FullControlOnMasters', 'ManageWeeklyPlanning', 'AddDailyUpdates', 'AllReports',
          'ManageWorkOrderMaster', 'ManageProductMaster', 'ManageMachineMaster', 'ManageOthers', 'FullControlOnMainFile', 'ViewLogs'
      ]
    };

    this.disabledPermissions = roleBasedDisabled[role] || [];

      // Pre-check permissions that are going to be disabled
    this.disabledPermissions.forEach(id => {
      if (!this.empPermissions.includes(id)) {
        this.empPermissions.push(id);
      }
    });
    // Optionally uncheck disabled permissions
    // this.empPermissions = this.empPermissions.filter(
    //   (id) => !this.disabledPermissions.includes(id)
    // );
  }

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
    this.employeeForm.setValidators(this.matchPasswords());
    this.employeeForm.get('role')?.valueChanges.subscribe((role) => {
      this.onRoleChange(role);
    });
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
        
        // Update disabled permissions based on role
        this.onRoleChange(this.employee.role || '');
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
    this.employeeForm.setValidators(this.matchPasswords());
    this.employeeForm.updateValueAndValidity();
  }

  // Validator to match passwords
  matchPasswords(): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const passwordControl = formGroup.get('password');
      const confirmPasswordControl = formGroup.get('confirm_password');

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mismatch']) {
        return null; // let other errors show
      }

      if (password !== confirmPassword) {
        confirmPasswordControl.setErrors({ mismatch: true });
      } else {
        // Only clear 'mismatch' error
        const errors = confirmPasswordControl.errors;
        if (errors) {
          delete errors['mismatch'];
          if (Object.keys(errors).length === 0) {
            confirmPasswordControl.setErrors(null);
          } else {
            confirmPasswordControl.setErrors(errors);
          }
        }
      }

      return null;
    };
  }

  // Submit Form
  onSubmit(): void {
    this.submitted = true;
    if (this.employeeForm.invalid) {
      return;
    }

    this.loading = true;

    if(this.employee){
      this.adminApiService.updateUserByAmin(this.employee.id, {...this.employeeForm.value, permissions: this.empPermissions}).subscribe({
        next: (res)=>{
          this.loading = false;
          // Emit an event with a message or any data
          this.notifyParent.emit(true);
        }, 
        error: (err)=>{
          this.loading = false;
        }
      });
    } else {
      this.adminApiService.register({...this.employeeForm.value, permissions: this.empPermissions}).subscribe({
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
}