

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from '../../services/storage/user-storage.service';
import { Coupon } from '../../models/coupon.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private BASE_URL = 'http://localhost:8080/api/customer'; // ✅ Fixed base URL

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/products`);
  }

  getAllProductsByName(name: any): Observable<any> {
    return this.http.get(`${this.BASE_URL}/search/${name}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  addToCart(productId: any): Observable<any> {
    const cartDto = {
      productId: productId,
      userId: UserStorageService.getUserId()
    };
    return this.http.post(`${this.BASE_URL}/cart`, cartDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  increaseProductQuantity(productId: any): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.post(`${this.BASE_URL}/cart/increase/${userId}/${productId}`,
      {},
      { headers: this.createAuthorizationHeader() }
    );
  }

  decreaseProductQuantity(productId: number): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.post(`${this.BASE_URL}/cart/decrease/${userId}/${productId}`,
      {},
      { headers: this.createAuthorizationHeader() }
    );
  }

  getCartByUserId(): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(`${this.BASE_URL}/cart/${userId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  applyCoupon(code: string): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(
      `${this.BASE_URL}/coupon/${userId}/${code}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }



  placeOrder(orderDto: any): Observable<any> {
    orderDto.userId = UserStorageService.getUserId();
    return this.http.post(`${this.BASE_URL}/placeOrder`, orderDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getOrderByUserId(): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(`${this.BASE_URL}/myOrders/${userId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getOrderedProducts(orderId: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/ordered-products/${orderId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  giveReview(formData: FormData): Observable<any> {
    return this.http.post(`${this.BASE_URL}/review`, formData, {
      headers: this.createAuthorizationHeader()
    });
  }

  addProductToWishlist(wishListDto: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/wishlist`, wishListDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getWishlistByUserId(): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(`${this.BASE_URL}/wishlist/${userId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getProductDetailById(productId: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/product/${productId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  removeProductFromWishlist(userId: number, productId: number): Observable<any> {
    return this.http.delete(
      `${this.BASE_URL}/wishlist/${userId}/${productId}`,
      { responseType: 'text' }
    );
  }

  getPublicCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${this.BASE_URL}/coupons`, {
      headers: this.createAuthorizationHeader()
    });
  }

  getCouponsForCustomer(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/coupons`, {
      headers: this.createAuthorizationHeader(),
    });
  }


  getCouponsForCustomernew(): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(`${this.BASE_URL}/Couponlist/${userId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }
  // private createAuthorizationHeader(): HttpHeaders {
  //   return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken());
  // }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken());
  }
}
