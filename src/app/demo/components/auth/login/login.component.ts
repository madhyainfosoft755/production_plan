import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Message } from 'primeng/api';

import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit {
    messages: Message[] | undefined;
    valCheck: string[] = ['remember'];

    password!: string;
    loginForm: FormGroup;
    loading = false;
    submitted: boolean = false;

    constructor(
        public layoutService: LayoutService,
        private fb: FormBuilder, 
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.authService.currentUser.subscribe({
            next: (user) => {
              if (user){
                this.router.navigate([`/${user.role.toLowerCase()}`]);
              }
            }
        });
        this.loginForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            rememberMe: [false] // Add Remember Me checkbox field
          });

        // Populate email and password from localStorage if available
        const savedCredentials = JSON.parse(localStorage.getItem('UNBRAKO_PPC_rememberedCredentials') || '{}');
        if (savedCredentials?.email && savedCredentials?.password) {
            this.loginForm.patchValue({
                email: savedCredentials.email,
                password: savedCredentials.password,
                rememberMe: true
            });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        this.authService.login(this.loginForm.value)
            .pipe(first())
            .subscribe(
                {
                    next: (data: any) => {
                        // Save credentials if Remember Me is checked
                        if (this.f['rememberMe'].value) {
                            localStorage.setItem('UNBRAKO_PPC_rememberedCredentials', JSON.stringify({
                                email: this.f['email'].value,
                                password: this.f['password'].value
                            }));
                        } else {
                            // Clear credentials if Remember Me is unchecked
                            localStorage.removeItem('UNBRAKO_PPC_rememberedCredentials');
                        }
                        this.loading = false;
                        this.router.navigate([`/${data.role.toLowerCase()}`]);
                    },
                    error: (error: any) => {
                        this.loading = false;
                        // this.serverErr = error.error;
                        this.messages = [
                            { severity: 'error', detail: error?.error?.message ?? 'Something went wrong.' }
                        ]
                    }
                }
                );
    }
}
