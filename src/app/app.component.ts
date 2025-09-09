import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

import { TitleService } from './demo/service/title.service';
import { AuthService } from './services/auth.service';
import { UnbrakoPPCommonService } from './services/unbrako-pp-common';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: `
        .auth-loader {
            position: fixed;         /* overlay the whole screen */
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: column;  /* stack text + icon */
            justify-content: center; /* vertical center */
            align-items: center;     /* horizontal center */

            background: rgba(255, 255, 255, 0.8); /* semi-transparent backdrop */
            font-size: 1.2rem;
            color: #333;
            z-index: 1000;           /* stay above other content */
        }

        .auth-loader i {
            font-size: 2rem;
            margin-top: 0.5rem;
        }

    `
})
export class AppComponent implements OnInit {
    isAuthenticating = false;
    constructor(
        private primengConfig: PrimeNGConfig,
        private titleService: TitleService,
        private authService: AuthService,
        private unbrakoPPCommonService: UnbrakoPPCommonService
    ) { }

    ngOnInit() {
        this.authService.isAuthenticating$.subscribe(flag => {
            this.isAuthenticating = flag;
        });
        this.unbrakoPPCommonService.getCurrentWeekNumber();
        this.authService.autoLogin();
        this.primengConfig.ripple = true;
    }
}
