import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  messages: Message[] | undefined;
  profileForm: FormGroup;
  submitted = false;
  loading = false;
  loadingProfile:  boolean = false;
  breadcrumbItems: any[];

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

  constructor(private fb: FormBuilder, private apiService: ApiService, private constantService: ConstantService) {
    this.profileForm = this.fb.group(
      {
        salutation: ['Mr.', Validators.required],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        emp_id: ['', Validators.required],
        role: ['', Validators.required]
      }
    );
  }

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'Profile' }
    ];
    this.load_profile();
  }

  load_profile(){
    this.loadingProfile = true;

    this.apiService.profile().subscribe({
      next: (res)=>{
        this.profileForm.patchValue({
          salutation: res.data.salutation,
          name: res.data.name,
          email: res.data.email_add,
          emp_id: res.data.emp_id,
          role: res.data.role
        });
        this.loadingProfile = false;
      }, 
      error: (err)=>{
        this.loadingProfile = false;
        console.log(err);
      }
    });
  }

  // Submit Form
  onSubmit(): void {
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;

    this.apiService.update_user(this.profileForm.value).subscribe({
      next: (res)=>{
        this.loading = false;
        this.messages = [
          { severity: 'success', detail: 'Profile updated successfully.' }
        ];
      }, 
      error: (err)=>{
        this.loading = false;
        console.log(err);
        this.messages = [
          { severity: 'error', detail: err?.error?.message }
        ];
      }
    });
  }
}