import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit{
  messages: Message[] | undefined;
  changePasswordForm: FormGroup;
  loading = false;
  breadcrumbItems: any[];

  constructor(
      private fb: FormBuilder, 
      private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'Change Password' }
    ];
      this.changePasswordForm = this.fb.group({
        current_password: ['', Validators.required],
        new_password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', Validators.required]
        },
        { validator: this.passwordMatchValidator });
      

  }

  // Custom validator for matching passwords
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('new_password')?.value;
    const confirmPassword = form.get('confirm_password')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // convenience getter for easy access to form fields
  get f() { return this.changePasswordForm.controls; }

  onSubmit() {
      
      // stop here if form is invalid
      if (this.changePasswordForm.invalid) {
          return;
      }
      this.loading = true;
      this.apiService.change_password(this.changePasswordForm.value)
          .subscribe(
              {
                  next: (data: any) => {
                    
                      this.loading = false;
                      this.changePasswordForm.reset();
                      this.messages = [
                        { severity: 'success', detail: 'Password changed successfully.' }
                    ]
                  },
                  error: (error: any) => {
                      this.loading = false;
                      // this.serverErr = error.error;
                      console.log(error)
                      this.messages = [
                          { severity: 'error', detail: error?.error?.message }
                      ]
                  }
              }
              );
  }
}


