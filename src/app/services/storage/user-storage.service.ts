// import { Injectable } from '@angular/core';

// const TOKEN = 'ecom-token';
// const USER = 'ecom-user';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserStorageService {

//   constructor() { }

//   public saveToken(token: string): void {
//     window.sessionStorage.removeItem(TOKEN);
//     window.sessionStorage.setItem(TOKEN, token);
//   }

//   public saveUser(user): void {
//     window.sessionStorage.removeItem(USER);
//     window.sessionStorage.setItem(USER, JSON.stringify(user));
//   }

//   static getToken(): string {
//     return localStorage.getItem(TOKEN);
//   }

//   static getUser(): any {
//     return JSON.parse(localStorage.getItem(USER));
//   }

//   static getUserId(): string {
//     const user = this.getUser();
//     if (user) {
//       return '';
//     }
//     return user.userId;
//   }


//   static getUserRole(): string {
//     const user = this.getUser();
//     if (user) {
//       return '';
//     }
//     return user.role;
//   }

//   static isAdminLoggedIn(): boolean {
//     if (this.getToken === null) {
//       return false;
//     }
//     const role: string = this.getUserRole();
//     return role === 'ADMIN';
//   }

//   static isCustomerLoggedIn(): boolean {
//     if (this.getToken === null) {
//       return false;
//     }
//     const role: string = this.getUserRole();
//     return role === 'CUSTOMER';
//   }

//   static signOut(): void {
//     window.localStorage.removeItem(TOKEN);
//     window.localStorage.removeItem(USER);
//   }

// }

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
