import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, catchError, throwError } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';

const BASIC_URL = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private userStorageService: UserStorageService
  ) { }

  register(signupRequest: any): Observable<any> {
    console.log(signupRequest);
    return this.http.post(BASIC_URL + "sign-up", signupRequest);
  }

  login(username: string, password: string): any {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    const body = { username, password };

    return this.http.post(BASIC_URL + "authenticate", body, { headers, observe: 'response' }).pipe(
      map((res) => {
        const token = res.headers.get('Authorization')?.substring(7);
        const user = res.body;
        if (token && user) {
          this.userStorageService.saveToken(token);
          this.userStorageService.saveUser(user);
          return user;
        }
        return false;
      }),
      catchError((error) => {
        // Pass the error to component for custom handling
        return throwError(() => error);
      })
    );
  }

  getOrderByTrackingId(trackingId: number): Observable<any> {
    return this.http.get(BASIC_URL + `order/${trackingId}`);
  }

  getUserInfo(userId: number): Observable<any> {
    const token = UserStorageService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(BASIC_URL + `api/user/info?userId=${userId}`, { headers });
  }

  updateUser(updatedData: any): Observable<any> {
    const token = UserStorageService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put(BASIC_URL + 'api/user/update', updatedData, { headers });
  }

  getAllUsers(): Observable<any> {
    const token = UserStorageService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(BASIC_URL + 'api/user/all', { headers });
  }

  // Works with /activate/{id} or /deactivate/{id}
  toggleUserActivation(userId: number, isActive: boolean): Observable<any> {
    const token = UserStorageService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const endpoint = isActive
      ? `api/user/deactivate/${userId}`
      : `api/user/activate/${userId}`;
    return this.http.put(BASIC_URL + endpoint, {}, { headers });
  }
}
