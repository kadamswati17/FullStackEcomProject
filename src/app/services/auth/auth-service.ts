import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, catchError, throwError, switchMap } from 'rxjs';
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

  // login(username: string, password: string): any {
  //   const headers = new HttpHeaders().set('content-type', 'application/json');
  //   const body = { username, password };

  //   return this.http.post(BASIC_URL + "authenticate", body, { headers, observe: 'response' }).pipe(
  //     map((res) => {
  //       const token = res.headers.get('Authorization')?.substring(7);
  //       const user = res.body;
  //       if (token && user) {
  //         this.userStorageService.saveToken(token);
  //         this.userStorageService.saveUser(user);
  //         return user;
  //       }
  //       return false;
  //     }),
  //     catchError((error) => {
  //       // Pass the error to component for custom handling
  //       return throwError(() => error);
  //     })
  //   );
  // }

  login(username: string, password: string): any {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    const body = { username, password };

    return this.http.post(BASIC_URL + "authenticate", body, { headers })
      .pipe(
        switchMap((res: any) => {

          const token = res.token;
          const userId = res.userId;
          const role = res.role;

          if (!token || !userId) return throwError(() => "Invalid login");

          this.userStorageService.saveToken(token);

          // STEP 2 → Load full user details
          return this.http.get(`${BASIC_URL}api/user/${userId}`).pipe(
            map((fullUser: any) => {

              console.log("FULL USER LOADED =", fullUser);

              // ⭐ VERY IMPORTANT FIX
              const finalUser = {
                userId: fullUser.id,
                role: fullUser.userRole,       // Correct key for UserStorageService
                name: fullUser.name,
                email: fullUser.email,
                mobile: fullUser.mobile,
                createdBy: fullUser.createdBy,
                image: fullUser.image
              };

              this.userStorageService.saveUser(finalUser);

              return finalUser;
            })
          );
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

  // src/app/services/auth/auth-service.ts (or wherever AuthService is)
  updateUser(formData: FormData): Observable<any> {
    const token = UserStorageService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // DO NOT set 'Content-Type' here — let browser set multipart boundary
    });
    return this.http.put(BASIC_URL + 'api/user/update', formData, { headers });
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
