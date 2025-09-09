
import { Injectable } from '@angular/core';
import { HttpHeaders} from '@angular/common/http';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  baseUrl: string = environment.apiBaseURL+'api/';

  constructor(
    private http: HttpService
  ) { }


  get_sap_data(): Observable<any>{
    return this.http.get(`${this.baseUrl}get-sap-data`);
  }

  add_new_machine_master(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}machine-master`, data);
  }

  

}