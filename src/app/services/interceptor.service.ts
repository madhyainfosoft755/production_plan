import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  token: string;
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('interceptor')
    return this.authService.currentUser.pipe(
      take(1),
      exhaustMap(user => {
        console.log('check user')
        if (!user) {
          return next.handle(req);
        }
        console.log('request modified')
        const modifiedReq = req.clone({
          // params: new HttpParams().set('Authorization', 'Bearer '+user.token)
          headers: new HttpHeaders().set('Authorization', 'Bearer '+user.token)
        });
        return next.handle(modifiedReq);
      })
    );
  }


}

export const InterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: InterceptorService,
  multi: true
}
