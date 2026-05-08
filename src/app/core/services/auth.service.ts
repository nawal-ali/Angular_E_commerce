import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  baseUrl = 'http://shopbag.runasp.net/api/Identity/Accounts';

  login(credentials: any) {
    return this.http.post(`${this.baseUrl}/Login`, credentials);
  }

  register(user: any) {
    return this.http.post(`${this.baseUrl}/Register`, user);
  }

  ConfirmEmail(token: string, userId: number) {
    return this.http.get(`${this.baseUrl}/ConfirmEmail?token=${token}&email=${userId}`);
  }

  ResendEmailConfirmation(email: string) {
    return this.http.post(`${this.baseUrl}/ResendEmailConfirmation`,email);
  }

  ForgetPassword(email: string) {
    return this.http.post(`${this.baseUrl}/ForgetPassword`, email);
  }

  ResetPassword(otpNumber: string, applicationUserId: string) {
    return this.http.post(`${this.baseUrl}/ResetPassword`, { otpNumber, applicationUserId });
  }

  NewPassword(password: string, confirmPassword: string, applicationUserId: string) {
    return this.http.post(`${this.baseUrl}/NewPassword`, { password, confirmPassword, applicationUserId });
  }
}
