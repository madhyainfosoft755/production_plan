
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  private apiUrl =  environment.apiBaseURL+'api/visitor/';

  constructor(private http: HttpClient) {}

  sendVisitorDetails() {
    const data = {
      ip_address: this.getIpAddress(),
      user_agent: window.navigator.userAgent,
    };
    return this.http.post(this.apiUrl, data).subscribe(response => {
      console.log('Visitor details sent successfully:', response);
    }, error => {
      console.error('Error sending visitor details:', error);
    });
  }

  getIpAddress() {
    // Fetch the IP address from an external service or the server side
    return '127.0.0.1';  // Placeholder IP
  }
}
