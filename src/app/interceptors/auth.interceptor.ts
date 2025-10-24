import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { inject } from '@angular/core';
import { take, exhaustMap, catchError  } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

// Global flag to ensure logout is only triggered once
let logoutTriggered = false;

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  return authService.currentUser.pipe(
    take(1),
    exhaustMap((user) => {
      if (!user) {
        return next(req);
      }
      const modifiedReq = req.clone({
        headers: new HttpHeaders().set('Authorization', `Bearer ${user.token}`),
      });
      // return next(modifiedReq);
      return next(modifiedReq).pipe(
        catchError((error) => {
          // Check if the error status is 401
          if (error.status === 401 && !logoutTriggered) {
            logoutTriggered = true;
            // Call the logout function from AuthService
            authService.logout();
          }
          // Re-throw the error so other parts of the application can handle it
          return throwError(() => error);
        })
      );
    })
  );
};
