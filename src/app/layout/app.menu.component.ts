import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from './service/app.layout.service';

import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    user: User|null;

    constructor(public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.authService.currentUser.subscribe({
            next: (user) => {
              if (user){
                this.user = user;
                this.user.permissions = this.user.permissions ?? [];
                console.log(user)
              }
            }
        });
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: [`/${this.user.role.toLowerCase()}`] }
                ]
            },
            {
                label: 'SAP',
                items: [
                    { label: 'Upload SAP', icon: 'pi pi-file-import', routerLink: [`/${this.user.role.toLowerCase()}/sap/upload`] },
                ],
                visible: (this.user.isAdmin || this.user.isMASTER || this.user.permissions.includes('UploadSAPFile'))
            },
            {
                label: 'Master',
                items: [
                    { label: 'Work Order Master', icon: 'pi pi-angle-right', routerLink: [`/${this.user.role.toLowerCase()}/masters/work-order-master`], badge: 'NEW', visible: (this.user.isAdmin || this.user.isMASTER || this.user.permissions.includes('ManageWorkOrderMaster')) },
                    { label: 'Product Master', icon: 'pi pi-angle-right', routerLink: [`/${this.user.role.toLowerCase()}/masters/product-master`], visible: (this.user.isAdmin || this.user.isMASTER || this.user.permissions.includes('ManageProductMaster')) },
                    { label: 'Machine Master', icon: 'pi pi-angle-right', routerLink: [`/${this.user.role.toLowerCase()}/masters/machine-master`], visible: (this.user.isAdmin || this.user.isMASTER || this.user.permissions.includes('ManageMachineMaster')) },
                ],
                visible: (this.user.isAdmin || this.user.isMASTER || ['FullControlOnMasters', 'ManageWorkOrderMaster', 'ManageProductMaster', 'ManageMachineMaster'].some(p => this.user.permissions.includes(p)))
            },
            {
                label: 'Main File',
                items: [
                    { label: 'This Month', icon: 'pi pi-angle-right', routerLink: [`/${this.user.role.toLowerCase()}/mainfile`], badge: 'NEW', visible: (this.user.isAdmin || this.user.isPLANNER || this.user.permissions.includes('FullControlOnMainFile')) },
                    // { label: 'Report', icon: 'pi pi-angle-right', routerLink: [`/${this.user.role.toLowerCase()}/mainfile/history`] },
                    { label: 'Daily Update', icon: 'pi pi-angle-right', routerLink: [`/${this.user.role.toLowerCase()}/mainfile/daily-update`], visible: (this.user.isAdmin || this.user.isPLANNER || this.user.isUSER || this.user.permissions.includes('AddDailyUpdates')) },
                    { label: 'Weekly Planning', icon: 'pi pi-angle-right', routerLink: [`/${this.user.role.toLowerCase()}/mainfile/weekly-planning`], visible: (this.user.isAdmin || this.user.isPLANNER || this.user.permissions.includes('ManageWeeklyPlanning')) },
                ],
                visible: (this.user.isAdmin || this.user.isPLANNER || this.user.isUSER || ['FullControlOnMainFile', 'ManageWeeklyPlanning', 'AddDailyUpdates'].some(p => this.user.permissions.includes(p)))
            },
            {
                label: 'Reports',
                items: [
                    { label: 'Module-machine Wise Monthly', icon: 'pi pi-fw pi-id-card', routerLink: [`/${this.user.role.toLowerCase()}/mainfile/history`] },
                    { label: 'Group Segment', icon: 'pi pi-fw pi-id-card', routerLink: [`/${this.user.role.toLowerCase()}/reports/report2`] },
                    { label: 'Groutp Target', icon: 'pi pi-fw pi-id-card', routerLink: [`/${this.user.role.toLowerCase()}/reports/report3`] },
                    // { label: 'Module-Machine Wise', icon: 'pi pi-fw pi-id-card', routerLink: [`/${this.user.role.toLowerCase()}/reports/report4`] },
                    { label: 'Plant Machine Booking', icon: 'pi pi-fw pi-id-card', routerLink: [`/${this.user.role.toLowerCase()}/reports/plant-machine-booking`] },
                ],
                visible: (this.user.isAdmin || this.user.isVIEWER || this.user.permissions.includes('AllReports'))
            },
            {
                label: 'Manage',
                items: [
                    { label: 'Employees', icon: 'pi pi-users', routerLink: ['/admin/employees'], badge: 'NEW', visible: (this.user.isAdmin) },
                    // { label: 'Customers', icon: 'pi pi-users', routerLink: ['/admin/customers'], badge: 'NEW' },
                    { label: 'Machines', icon: 'pi pi-fw pi-globe', routerLink: [`/${this.user.role.toLowerCase()}/machines`], visible: (this.user.isAdmin || this.user.isMASTER || this.user.permissions.includes('ManageMachineMaster')) },
                    { label: 'Others', icon: 'pi pi-fw pi', routerLink: [`/${this.user.role.toLowerCase()}/others`], visible: (this.user.isAdmin || this.user.isMASTER || this.user.permissions.includes('ManageOthers')) },
                    { label: 'Logs', icon: 'pi pi-fw pi', routerLink: [`/${this.user.role.toLowerCase()}/logs`], visible: (this.user.isAdmin || this.user.isMASTER || this.user.permissions.includes('ViewLogs')) },
                ],
                visible: (this.user.isAdmin || this.user.isMASTER || this.user.permissions.includes('ManageOthers'))
            },
            // {
            //     label: 'External',
            //     items: [
            //         { label: 'PPAP', icon: 'pi pi-external-link', command: () => window.open('https://example.com/ppap', '_blank') },
            //         { label: 'Production Log', icon: 'pi pi-external-link', command: () => window.open('https://example.com/ppap', '_blank') },
            //         { label: 'Productoin Drawing', icon: 'pi pi-external-link', command: () => window.open('https://example.com/ppap', '_blank') }
            //     ]
            // },
            // {
            //     label: 'UI Components',
            //     items: [
            //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/uikit/formlayout'] },
            //         { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/admin/uikit/input'] },
            //         { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/admin/uikit/floatlabel'] },
            //         { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/admin/uikit/invalidstate'] },
            //         { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/admin/uikit/button'] },
            //         { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/admin/uikit/table'] },
            //         { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/admin/uikit/list'] },
            //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/admin/uikit/tree'] },
            //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/admin/uikit/panel'] },
            //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/admin/uikit/overlay'] },
            //         { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/admin/uikit/media'] },
            //         { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/admin/uikit/menu'], routerLinkActivadmin/eOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
            //         { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/admin/uikit/message'] },
            //         { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/admin/uikit/file'] },
            //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/admin/uikit/charts'] },
            //         { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/admin/uikit/misc'] }
            //     ]
            // },
            // {
            //     label: 'Prime Blocks',
            //     items: [
            //         { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/admin/blocks'], badge: 'NEW' },
            //         { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
            //     ]
            // },
            // {
            //     label: 'Utilities',
            //     items: [
            //         { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/admin/utilities/icons'] },
            //         { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
            //     ]
            // },
            // {
            //     label: 'Pages',
            //     icon: 'pi pi-fw pi-briefcase',
            //     items: [
            //         {
            //             label: 'Landing',
            //             icon: 'pi pi-fw pi-globe',
            //             routerLink: ['/admin/landing']
            //         },
            //         {
            //             label: 'Auth',
            //             icon: 'pi pi-fw pi-user',
            //             items: [
            //                 {
            //                     label: 'Login',
            //                     icon: 'pi pi-fw pi-sign-in',
            //                     routerLink: ['/admin/auth/login']
            //                 },
            //                 {
            //                     label: 'Error',
            //                     icon: 'pi pi-fw pi-times-circle',
            //                     routerLink: ['/admin/auth/error']
            //                 },
            //                 {
            //                     label: 'Access Denied',
            //                     icon: 'pi pi-fw pi-lock',
            //                     routerLink: ['/admin/auth/access']
            //                 }
            //             ]
            //         },
            //         {
            //             label: 'Crud',
            //             icon: 'pi pi-fw pi-pencil',
            //             routerLink: ['/admin/pages/crud']
            //         },
            //         {
            //             label: 'Timeline',
            //             icon: 'pi pi-fw pi-calendar',
            //             routerLink: ['/admin/pages/timeline']
            //         },
            //         {
            //             label: 'Not Found',
            //             icon: 'pi pi-fw pi-exclamation-circle',
            //             routerLink: ['/admin/notfound']
            //         },
            //         {
            //             label: 'Empty',
            //             icon: 'pi pi-fw pi-circle-off',
            //             routerLink: ['/admin/pages/empty']
            //         },
            //     ]
            // },
            // {
            //     label: 'Hierarchy',
            //     items: [
            //         {
            //             label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //             ]
            //         },
            //         {
            //             label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
            //                     ]
            //                 },
            //             ]
            //         }
            //     ]
            // },
            // {
            //     label: 'Get Started',
            //     items: [
            //         {
            //             label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/admin/documentation']
            //         },
            //         {
            //             label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
            //         }
            //     ]
            // }
        ];
    }
}
