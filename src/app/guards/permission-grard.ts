import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap, take, filter, timeout } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // const user = this.authService.currentUser;
    return this.authService.currentUser.pipe(
      filter(user => user !== null),
        timeout(5000), // wait until user is emitted
            take(1),
            map(user => {
                if (!user) {
                  this.router.navigate(['/auth/login']);
                  return false;
                }
                if(user.role === 'ADMIN'){
                    return true;
                }
            
                // Always allowed routes
                if (route.data['alwaysAllow']) {
                  return true;
                }
            
                // Role check
                const requiredRole: string[] = route.data['role'];
                console.log(route.data);
                console.log(route.data['role']);
                console.log(user.role);

                let returnValRole = true;
                // console.lo
                if (requiredRole && !requiredRole.includes(user.role)) {
                //   this.router.navigate(['/unauthorized']);
                  returnValRole= false;
                }
                console.log('role pass');

                console.log(route.data['permission']);
                console.log(user?.permissions);
                // Permission check
                let returnValRolePer = true;
                const requiredPermission = route.data['permission'];
                console.log(requiredPermission && !user?.permissions?.includes(requiredPermission));
                if (requiredPermission && !user?.permissions?.includes(requiredPermission)) {
                //   this.router.navigate(['/unauthorized']);
                  returnValRolePer= false;
                }

                if(returnValRole || returnValRolePer){
                    return true;
                } else {
                    // this.router.navigate(['/unauthorized']);
                    this.router.navigate(['/auth/login']);
                    return false;
                }
                // return true;
                // return returnValRole || returnValRolePer ? true : false;
            })
    );
  }
}
