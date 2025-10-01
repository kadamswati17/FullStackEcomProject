import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from '../../services/storage/user-storage.service';

const BASIC_URL = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/customer/products', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllProductsByName(name: any): Observable<any> {
    return this.http.get(BASIC_URL + `api/customer/search/${name}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  addToCart(productId: any): Observable<any> {
    const cartDto = {
      productId: productId,
      userId: UserStorageService.getUserId()
    };
    return this.http.post(BASIC_URL + 'api/customer/cart', cartDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // increaseProductQuantity(productId: any): Observable<any> {
  //   const userId = UserStorageService.getUserId();
  //   return this.http.post(
  //     `${BASIC_URL}api/customer/cart/increase/${userId}/${productId}`,
  //     {},
  //     { headers: this.createAuthorizationHeader() }
  //   );
  // }

  // decreaseProductQuantity(productId: number): Observable<any> {
  //   const userId = UserStorageService.getUserId();
  //   return this.http.post(
  //     `${BASIC_URL}api/customer/cart/decrease/${userId}/${productId}`,
  //     {},
  //     { headers: this.createAuthorizationHeader() }
  //   );
  // }


  increaseProductQuantity(productId: any): Observable<any> {
    const userId = UserStorageService.getUserId();
    console.log("service uid", userId);

    return this.http.post(`${BASIC_URL}api/customer/cart/increase/${userId}/${productId}`,
      {},
      { headers: this.createAuthorizationHeader() }
    );
  }

  decreaseProductQuantity(productId: number): Observable<any> {
    const userId = UserStorageService.getUserId();

    console.log("service uid", userId);
    return this.http.post(`${BASIC_URL}api/customer/cart/decrease/${userId}/${productId}`,
      {},
      { headers: this.createAuthorizationHeader() }
    );
  }

  getCartByUserId(): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(BASIC_URL + `api/customer/cart/${userId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  applyCoupon(code: string): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(`${BASIC_URL}api/customer/coupon/${userId}/${code}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  placeOrder(orderDto: any): Observable<any> {
    orderDto.userId = UserStorageService.getUserId();
    return this.http.post(BASIC_URL + `api/customer/placeOrder`, orderDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getOrderByUserId(): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(BASIC_URL + `api/customer/myOrders/${userId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getOrderedProducts(orderId: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/customer/ordered-products/${orderId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  giveReview(reviewDto: any): Observable<any> {
    reviewDto.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    return this.http.post(BASIC_URL + `api/customer/review`, reviewDto, {
      headers: this.createAuthorizationHeader(),
    });
  }


  addProductToWishlist(wishListDto: any): Observable<any> {
    return this.http.post(BASIC_URL + `api/customer/wishlist`, wishListDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getWishlistByUserId(): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(BASIC_URL + `api/customer/wishlist/${userId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getProductDetails(productId: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/customer/product/${productId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }


  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken());
  }
}
