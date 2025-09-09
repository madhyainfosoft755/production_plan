import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './guards/auth.guard';
// import { UserAuthGuard } from "./guards/user-auth.guard";
// import { PlannerAuthGuard } from './guards/planner-auth.guard';
// import { MasterAuthGuard } from './guards/master-auth.guard';
import { PermissionGuard } from './guards/permission-grard';
import { sharedRoutes } from './shared/shared-routes';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: 'auth/login',
                pathMatch: 'full'
            },
            {
                path: 'user',
                component: AppLayoutComponent,
                canActivate: [AuthGuard],
                children: [
                    { path: '', loadChildren: () => import('./demo/components/admin/user/user.module').then(m => m.UserModule) }
                ]
            },
            {
                path: 'admin', 
                component: AppLayoutComponent,
                canActivate: [PermissionGuard],
                data: { role: ['ADMIN'] },
                children: [
                    {path: '', loadChildren: () => import('./demo/components/admin/admin.module').then(m => m.AdminModule)},
                    // { path: '', loadChildren: () => import('./demo/components/admin/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    // { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    // { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    // { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    // { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    // { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
                    // { path: 'masters', loadChildren: () => import('./demo/components/admin/masters/masters.module').then(m => m.MastersModule) },
                    // { path: 'employees', loadChildren: () => import('./demo/components/admin/employees/employees.module').then(m => m.EmployeesModule) },
                    // // { path: 'customers', loadChildren: () => import('./demo/components/admin/customers/customers.module').then(m => m.CustomersModule) },
                    // { path: 'machines', loadChildren: () => import('./demo/components/admin/machines/machines.module').then(m => m.MachinesModule) },
                    // { path: 'others', loadChildren: () => import('./demo/components/admin/others/others.module').then(m => m.OthersModule) },
                    // { path: 'sap', loadChildren: () => import('./demo/components/admin/sap/sap.module').then(m => m.SapModule) },
                    // // { path: 'user', loadChildren: () => import('./demo/components/admin/user/user.module').then(m => m.UserModule) },
                    // { path: 'mainfile', loadChildren: () => import('./demo/components/admin/main/main.module').then(m => m.MainModule) },
                    // { path: 'reports', loadChildren: () => import('./shared/components/shared-reports/shared-reports.module').then(m => m.SharedReportsModule) }
                ]
            },
            {
                path: 'master', 
                component: AppLayoutComponent,
                canActivate: [PermissionGuard],
                data: { role: ['MASTER'] },
                children: [
                    {path: '', loadChildren: () => import('./demo/components/master/master.module').then(m => m.MasterModule)},
                ]
            },
            // {
            //     path: 'user', component: AppLayoutComponent,
            //     canActivate: [PermissionGuard],
            //     data: { role: ['USER'] },
            //     children: [
            //         { path: '', loadChildren: () => import('./demo/components/forging/dashboard/dashboard.module').then(m => m.DashboardModule) },
            //         // { path: 'mainfile', loadChildren: () => import('./demo/components/forging/forging-main/user-main.module').then(m => m.UserMainModule) }
            //         ...sharedRoutes
            //     ]
            // },
            {
                path: 'planner', component: AppLayoutComponent,
                canActivate: [PermissionGuard],
                data: { role: ['PLANNER'] },
                children: [
                    { path: '', loadChildren: () => import('./demo/components/rm/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    // { path: 'mainfile', loadChildren: () => import('./demo/components/rm/rm-main/rm-main.module').then(m => m.RMMainModule) }
                    ...sharedRoutes
                ]
            },
            {
                path: 'viewer', component: AppLayoutComponent,
                canActivate: [PermissionGuard],
                data: { role: ['VIEWER'] },
                children: [
                    { path: '', loadChildren: () => import('./demo/components/viewer/dashboard/dashboard.module').then(m => m.ViewerDashboardModule) },
                    // { path: 'mainfile', loadChildren: () => import('./demo/components/rm/rm-main/rm-main.module').then(m => m.RMMainModule) }
                    ...sharedRoutes
                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            // { path: 'notfound', component: NotfoundComponent },
            // { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
