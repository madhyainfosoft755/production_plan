import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorHandlingInterceptor } from './interceptors/error-handling.interceptor';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [CommonModule, AppRoutingModule, AppLayoutModule, ToastModule],
    providers: [
        provideHttpClient(withInterceptors([errorHandlingInterceptor, authInterceptor])),
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, DatePipe, MessageService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
