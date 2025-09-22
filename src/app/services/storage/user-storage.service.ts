import { Injectable } from '@angular/core';

const TOKEN = 'ecom-token';
const USER = 'ecom-user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() { }

  public saveToken(token: string): void {
    window.sessionStorage.setItem(TOKEN, token);
  }

  public saveUser(user: any): void {
    window.sessionStorage.setItem(USER, JSON.stringify(user));
  }

  static getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN);
  }

  static getUser(): any {
    const user = window.sessionStorage.getItem(USER);
    return user ? JSON.parse(user) : null;
  }

  static getUserId(): string | null {
    const user = this.getUser();
    return user ? user.userId : null;
  }

  static getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  static isAdminLoggedIn(): boolean {
    const token = this.getToken();
    const role = this.getUserRole();
    return token != null && role === 'ADMIN';
  }

  static isCustomerLoggedIn(): boolean {
    const token = this.getToken();
    const role = this.getUserRole();
    return token != null && role === 'CUSTOMER';
  }

  static signOut(): void {
    window.sessionStorage.removeItem(TOKEN);
    window.sessionStorage.removeItem(USER);
  }

}
