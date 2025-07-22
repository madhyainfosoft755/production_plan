import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

import { TitleService } from './demo/service/title.service';
import { AuthService } from './services/auth.service';
import { UnbrakoPPCommonService } from './services/unbrako-pp-common';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(
        private primengConfig: PrimeNGConfig,
        private titleService: TitleService,
        private authService: AuthService,
        private unbrakoPPCommonService: UnbrakoPPCommonService
    ) { }

    ngOnInit() {
        this.unbrakoPPCommonService.getCurrentWeekNumber();
        this.authService.autoLogin();
        this.primengConfig.ripple = true;
    }
}
