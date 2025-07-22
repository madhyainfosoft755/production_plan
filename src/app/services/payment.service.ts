import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = environment.apiBaseURL;

  constructor(private http: HttpClient) { }

  createOrder(amount: number, tokens: number) {
    return this.http.post(`${this.baseUrl}api/create-order/`, { amount, tokens });
  }

  verifyPayment(paymentData: any) {
    return this.http.post(`${this.baseUrl}api/payment-callback/`, paymentData);
  }

  paymentDismissed(order_id: string) {
    return this.http.post(`${this.baseUrl}api/payment-dismissed/`, { order_id });
  }
}
