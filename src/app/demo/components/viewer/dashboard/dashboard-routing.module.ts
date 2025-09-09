import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ViewerDashboardComponent } from './dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ViewerDashboardComponent, data: { title: 'Viewer Dashboard' } }
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
