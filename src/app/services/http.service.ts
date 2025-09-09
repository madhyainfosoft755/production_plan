import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(public http: HttpClient) { }

  setAuthHeaders() {
    const headerJson: any = {};
    // const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    // if (token) {
      headerJson['Content-Type'] = 'application/json';
      // headerJson['Authorization'] = 'Bearer ' + token;
    // }
    return new HttpHeaders(headerJson);
  }

  get(url: string, Qparams: any={}) {
    if(Qparams){
      let paramss = new HttpParams();
      for (let key in Qparams) {
        paramss = paramss.set(key, Qparams[key]);
      }
      return this.http.get(url, {params: paramss}) as Observable<any>;
    }
    return this.http.get(url) as Observable<any>;
  }

  getBlob(url: string) {
    return this.http.get(url, { responseType: 'blob', observe: 'response' }) as Observable<any>;
  }

  post(url: string, model: any, options: any=null) {
    // const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    if(options){
      return this.http.post(url, model, options) as Observable<any>;
    } else {
      return this.http.post(url, model) as Observable<any>;
    }
  }

  put(url: string, model: any) {
    return this.http.put(url, model) as Observable<any>;
  }

  patch(url: string, model: any) {
    return this.http.patch(url, model) as Observable<any>;
  }

  delete(url: string, model: any = null) {
    return this.http.delete(url) as Observable<any>;
  }

  // handleException(err: any) {
  //   if (err.statusText === 'Unauthorized') {
  //     // location.reload();
  //   } else {
  //     return Observable.throw(err);
  //   }
  // }
}
