import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

<<<<<<< HEAD
=======

>>>>>>> 908029f71f57c24858f14ed02f2eeb35a088aa2f
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
