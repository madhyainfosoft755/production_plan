import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';
import { Message } from 'primeng/api';
import { Subscription, interval } from 'rxjs';

import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  messages: Message[] | undefined;

  password!: string;
  resetPasswordForm: FormGroup;
  loading = false;
  submitted: boolean = false;
  validToken: boolean = false;
  checkTokenLoading: boolean = true;
  token: string | null = null;
  tokenCheckInterval$: Subscription | null = null;

  constructor(
      public layoutService: LayoutService,
      private fb: FormBuilder, 
      private router: Router,
      private apiService: ApiService,
      private authService: AuthService,
      private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
      this.authService.currentUser.subscribe({
          next: (user) => {
            if (user){
              this.router.navigate(['/']);
            }
          }
      });
      this.resetPasswordForm = this.fb.group({
        new_password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', Validators.required]
        },
        { validator: this.passwordMatchValidator });
       // Access the token from the route parameters
       this.token = this.route.snapshot.paramMap.get('token');

       // Optionally, handle scenarios where the token is missing
       if (!this.token) {
           this.messages = [
            { severity: 'error', detail: 'Token not found!' }
          ]
          this.checkTokenLoading = false;
       } else{
          this.startTokenValidation(this.token);
         this.check_token(this.token);
       }
      

  }

  ngOnDestroy(): void {
      // Clean up the interval on component destruction
      if (this.tokenCheckInterval$) {
          this.tokenCheckInterval$.unsubscribe();
      }
  }

  startTokenValidation(token: string): void {
      // Call the check_token method every 2 minutes
      this.tokenCheckInterval$ = interval(2 * 60 * 1000).subscribe(() => {
          this.check_token(token);
      });
  }

  check_token(token:string){
    this.apiService.check_reset_token({token: token})
          .subscribe(
              {
                  next: (data: any) => {
                      this.checkTokenLoading = false;
                      this.validToken = true;
                  },
                  error: (error: any) => {
                      this.validToken = false;
                      this.checkTokenLoading = false;
                      this.messages = [
                          { severity: 'error', detail: error?.error?.message }
                      ]
                  }
              }
              );
  }


  // Custom validator for matching passwords
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('new_password')?.value;
    const confirmPassword = form.get('confirm_password')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetPasswordForm.controls; }

  onSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      if (this.resetPasswordForm.invalid) {
          return;
      }
      this.loading = true;
      this.apiService.reset_password({...this.resetPasswordForm.value, token : this.token})
          .subscribe(
              {
                  next: (data: any) => {
                    this.submitted = false;
                      this.loading = false;
                      this.resetPasswordForm.reset();
                      this.messages = [
                        { severity: 'success', detail: 'Reset password link sent to your email.' }
                    ]
                  },
                  error: (error: any) => {
                    this.submitted = false;
                      this.loading = false;
                      this.messages = [
                          { severity: 'error', detail: error?.error?.message }
                      ]
                  }
              }
              );
  }
}

