import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  isAuthenticated(): boolean {
  return !!localStorage.getItem('authToken');
}

  constructor() { }
  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token; // Returns true if token exists, false otherwise
  }

  getUser(){
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
