import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';

import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  messages: Message[] | undefined;

  password!: string;
  forgotPasswordForm: FormGroup;
  loading = false;
  submitted: boolean = false;

  constructor(
      public layoutService: LayoutService,
      private fb: FormBuilder, 
      private router: Router,
      private apiService: ApiService,
      private authService: AuthService
  ) { }

  ngOnInit(): void {
      this.authService.currentUser.subscribe({
          next: (user) => {
            if (user){
              this.router.navigate(['/']);
            }
          }
      });
      this.forgotPasswordForm = this.fb.group({
          email: ['', Validators.required]
        });
  }

  // convenience getter for easy access to form fields
  get f() { return this.forgotPasswordForm.controls; }

  onSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      if (this.forgotPasswordForm.invalid) {
          return;
      }
      this.loading = true;
      this.apiService.forgot_password(this.forgotPasswordForm.value)
          .subscribe(
              {
                  next: (data: any) => {
                    this.submitted = false;
                      this.loading = false;
                      this.forgotPasswordForm.reset();
                      this.messages = [
                        { severity: 'success', detail: 'Reset password link sent to your email.' }
                    ]
                  },
                  error: (error: any) => {
                    this.submitted = false;
                      this.loading = false;
                      // this.serverErr = error.error;
                      this.messages = [
                          { severity: 'error', detail: error?.error?.message }
                      ]
                  }
              }
              );
  }
}
