
import { Injectable } from '@angular/core';
import { HttpHeaders} from '@angular/common/http';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl: string = environment.apiBaseURL+'api/';

  meal_times= [
    { id: 1, name: "Breakfast" },
    { id: 2, name: "Brunch" },
    { id: 3, name: "Lunch" },
    { id: 4, name: "Hightea" },
    { id: 5, name: "Dinner" },
  ];
  constructor(
    private http: HttpService
  ) { }
  
  // headers = new HttpHeaders({
  //   'Content-Type': 'application/json',
  // });

  // getCookie(name: string): string | null {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  //   return null;
  // }


  // // Retrieve the CSRF token from the cookie
  // csrftoken: any = this.getCookie('csrftoken');
  // if (csrftoken: any) {
  //   this.headers.append('X-CSRFToken', csrftoken);
  // }
  
  forgot_password(data: {email: string}): Observable<any>{
    return this.http.post(`${this.baseUrl}user/forgot-password/`, data);
  }


  check_reset_token(data: {token: string}): Observable<any>{
    return this.http.post(`${this.baseUrl}user/check-reset-token`, data);
  }

  reset_password(data: {token: any, new_password: string, confirm_password: string}): Observable<any>{
    return this.http.post(`${this.baseUrl}user/reset-password/`, data);
  }

  change_password(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}change-password`, data);
  }

  profile(): Observable<any>{
    return this.http.get(`${this.baseUrl}profile`);
  }

  update_user(data: any): Observable<any>{
    return this.http.put(`${this.baseUrl}user/update`, data);
  }
  

}