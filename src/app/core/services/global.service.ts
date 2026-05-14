import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

    isAuthenticated(): boolean {
  return !!localStorage.getItem('authToken');}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserRoles(): string[] {
    const token = localStorage.getItem('authToken');
    if (!token) return [];
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const roles = payload[roleKey] ?? payload['role'] ?? [];
      return Array.isArray(roles) ? roles : [roles];
    } catch {
      return [];
    }
  }

  isAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('AdminRole') || roles.includes('SuperAdminRole');
  }
}