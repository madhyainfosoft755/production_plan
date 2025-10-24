
import { Injectable } from '@angular/core';
import { HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { HttpService } from './http.service';
import {User} from '../models/user';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private redirectUrl: string | null = null;
  private accessToken = '';
  baseUrl: string = environment.apiBaseURL+'api/';
  currentUser = new BehaviorSubject<User | null>(null);
  public isAuthenticating$ = new BehaviorSubject<boolean>(false);
  tokenInfo = new BehaviorSubject<{total_tokens: number,remaining_tokens: number}>({total_tokens: 0,remaining_tokens: 0});
  refresh_token : string|null = null;
  jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpService,
    private router: Router
  ) { }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string | null {
    return this.redirectUrl;
  }

  clearRedirectUrl(): void {
    this.redirectUrl = null;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  setupUser(response: any) {
    const res: any = response;
    const user = new User({id: res.id, name: res.name, emp_id: res.emp_id, email: res.email, role: res.role, token: res.token, permissions: res.permissions});
    this.accessToken = res.token;
    this.currentUser.next(user);

    // Clone user and remove permissions before storing in localStorage
    const userToStore = { ...user };
    delete userToStore.permissions;
    localStorage.setItem('UNBRAKO_PPC_USER', JSON.stringify(userToStore));
    return res;
  }

  login(data:any): Observable<any>{
    // return this.http.post(`${this.baseUrl}crbs`, {...data}, { headers: this.headers });
    return this.http.post(`${this.baseUrl}login`, {...data}).pipe(
      map((response: any) => {
        return this.setupUser(response);
      })
    );
  }

  logout() {
    return this.http.get(`${this.baseUrl}logout`).subscribe({
      next: () => {
        localStorage.removeItem('UNBRAKO_PPC_USER');
        this.accessToken = '';
        this.currentUser.next(null);
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        localStorage.removeItem('UNBRAKO_PPC_USER');
        this.accessToken = '';
        this.currentUser.next(null);
        this.router.navigate(['/auth/login']);
      }
    });
  }

  // Get the value of a cookie
  getCookie(name:string) {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1).trim();
      }
    }
    return null;
  }

  // Delete a cookie
  deleteCookie(name: string) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  private _forceLogout() {
    localStorage.removeItem('UNBRAKO_PPC_USER');
    this.accessToken = '';
    this.currentUser.next(null);
    this.router.navigate(['/auth/login']);
  }

  autoLogin(): Promise<boolean>{
    
    return new Promise((resolve, reject) => { 
      try {
        const userDataJSON = localStorage.getItem('UNBRAKO_PPC_USER');
        if (!userDataJSON) {
          resolve(false);
          this._forceLogout();
          return;
        }
        let userData: any;
        try{
          userData
          // : {
          //   email: string;
          //   id: number;
          //   _token: string;
          //   name: string;
          //   emp_id: string;
          //   role: string;
          // } | null 
          = userDataJSON ? JSON.parse(userDataJSON) : null;
          if (!userData) {
            this._forceLogout();
            resolve(false);
            return;
          }
          // Basic structure check (optional, extend as needed)
          if (
            typeof userData.id !== 'number' ||
            typeof userData.name !== 'string' ||
            typeof userData.emp_id !== 'string' ||
            typeof userData.email !== 'string' ||
            typeof userData._token !== 'string' ||
            typeof userData.role !== 'string'
          ) {
            throw new Error('Corrupted user data');
          }
        } catch (parseError) {
          this._forceLogout();
          resolve(false);
          return;
        }
        this.accessToken = userData._token;
        const loadedUser = new User({
          id: userData.id, 
          name: userData.name, 
          emp_id: userData.emp_id, 
          email: userData.email, 
          role: userData.role, 
          token: userData._token,
          permissions: null
        });
        if (loadedUser.token) {
          this.isAuthenticating$.next(true);
          // call api to get user permissions from user id
          this.http.get(`${this.baseUrl}get-permissions/${loadedUser.id}`).subscribe({
            next: (res: any) => {
              if (res.permissions === undefined) {
                this._forceLogout();
                this.isAuthenticating$.next(false);
                resolve(false);
              }
              loadedUser.permissions = res.permissions;
              this.currentUser.next(loadedUser);
              this.isAuthenticating$.next(false);
              resolve(true);
            },
            error: (err) => {
              this._forceLogout();
              this.isAuthenticating$.next(false);
              resolve(false);
            }
          });
        } else {
          this._forceLogout();
          resolve(false);
        }
      }
        catch (error) {
        this._forceLogout();
        resolve(false);
      }
    });

  }

}