import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PermissionGuard } from 'src/app/guards/permission-grard';
import { sharedRoutes } from 'src/app/shared/shared-routes';

const routes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { role: ['USER'] },
    children: [
        { path: '', loadChildren: () => import('../../forging/dashboard/dashboard.module').then(m => m.DashboardModule) },
        // { path: 'mainfile', loadChildren: () => import('./demo/components/forging/forging-main/user-main.module').then(m => m.UserMainModule) }
        ...sharedRoutes
    ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { title: 'User Profile' }
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    data: { title: 'Change Password' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
