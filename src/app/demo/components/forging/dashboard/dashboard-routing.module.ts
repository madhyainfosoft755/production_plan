import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent, data: { title: 'Admin Dashboard' } }
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
