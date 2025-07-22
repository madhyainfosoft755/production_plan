import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UnbrakoPPCommonService } from '../services/unbrako-pp-common';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [ConfirmationService]
})
export class AppTopBarComponent implements OnInit {
    currentWeek: any;

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public router: Router ,
        public layoutService: LayoutService,
        private confirmationService: ConfirmationService, 
        private authService: AuthService,
        private unbrakoPPCommonService: UnbrakoPPCommonService
    ) { }
    ngOnInit() {
        this.currentWeek = this.unbrakoPPCommonService.currentWeek? {
            week_number: this.unbrakoPPCommonService.currentWeek.week_number,
            start_date: this.unbrakoPPCommonService.currentWeek.start_date.toLocaleDateString('en-IN', { month: '2-digit', day: '2-digit', year: 'numeric' }),
            end_date: this.unbrakoPPCommonService.currentWeek.end_date.toLocaleDateString('en-IN', { month: '2-digit', day: '2-digit', year: 'numeric' })
        } : null;
        // date.toLocaleDateString('en-IN', { month: '2-digit', day: '2-digit', year: 'numeric' });
        this.items = [
            {
                label: 'Options',
                items: [
                    {
                        label: 'Profile',
                        icon: 'pi pi-user',
                        command: () => {
                            this.router.navigate(['/user/profile']);
                        }
                    },
                    {
                        label: 'Change Password',
                        icon: 'pi pi-lock',
                        command: () => {
                            this.router.navigate(['/user/change-password']);
                        }
                    }
                ]
            },
            {
                separator: true
            },
            {
                items: [
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        shortcut: '⌘+Q',
                        command: () => {
                            this.confirm(event);
                        }
                    }
                ]
            },
        ];
    }

    confirm(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to logout?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass:"p-button",
            acceptButtonStyleClass: 'p-button-outlined',
            accept: () => {
                // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
                this.authService.logout();
            },
            reject: () => {
                // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    }
}
