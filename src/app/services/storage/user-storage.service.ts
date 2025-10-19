import { Injectable } from '@angular/core';

const TOKEN_KEY = 'ecom-token';
const USER_KEY = 'ecom-user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() { }

  // Save token and user
  public saveToken(token: string): void {
    if (token) {
      window.sessionStorage.setItem(TOKEN_KEY, token);
    }
  }

  public saveUser(user: any): void {
    if (user) {
      window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  // Get token
  public static getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  // Get user object
  public static getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    try {
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user from storage:', error);
      return null;
    }
  }

  // Get individual values
  public static getUserId(): string | null {
    const user = this.getUser();
    return user && user.userId ? user.userId : null;
  }

  public static getUserRole(): string | null {
    const user = this.getUser();
    return user && user.role ? user.role : null;
  }

  // Role checks
  public static isAdminLoggedIn(): boolean {
    const token = this.getToken();
    const role = this.getUserRole();
    return !!token && role === 'ADMIN' || role === 'PARENT_ADMIN';
  }

  public static isCustomerLoggedIn(): boolean {
    const token = this.getToken();
    const role = this.getUserRole();
    return !!token && role === 'CUSTOMER';
  }

  public static isparentuserLoggedIn(): boolean {
    const token = this.getToken();
    const role = this.getUserRole();
    console.log("role", role);
    return !!token && role == 'PARENT_ADMIN';
  }

  // Clear session (on logout)
  public static signOut(): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(USER_KEY);
  }
}
