import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';

// const BASIC_URL = 'http://localhost:8080/';


//const BASIC_URL = 'http://localhost:8080/';

//const BASIC_URL = 'http://localhost:8081/';
//const BASIC_URL = 'http://localhost:8080/ecom';
// const BASIC_URL = 'https://103.168.19.63:8443/ecom/';
const BASIC_URL = 'http://103.168.19.63:8080/ecom/';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private userStorageService: UserStorageService   // ✅ inject here
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
        const token = res.headers.get('Authorization').substring(7);
        const user = res.body;
        if (token && user) {
          this.userStorageService.saveToken(token);
          this.userStorageService.saveUser(user);
          return user;
        }
        return false;
      })
    );
  }

  getOrderByTrackingId(trackingId: number): Observable<any> {
    return this.http.get(BASIC_URL + `order/${trackingId}`);
  }
}