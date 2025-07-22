import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class RMAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.currentUser.pipe(
        take(1),
        map(user => {
          const isAuth = !!user;
          if (isAuth && user.isRM) {
            // console.log(user)
            // console.log('Admin '+user.isAdmin)
            return true;
          }
          return this.router.createUrlTree(['/auth/login']);
        })
      );
  }
  
}
