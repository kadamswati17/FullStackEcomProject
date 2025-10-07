// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { UserStorageService } from '../../services/storage/user-storage.service';

// const BASIC_URL = 'http://localhost:8080/';

// @Injectable({
//   providedIn: 'root'
// })
// export class CustomerService {

//   constructor(private http: HttpClient) { }


//   getAllProducts(): Observable<any> {
//     return this.http.get(BASIC_URL + 'api/customer/products'); // no headers
//   }


//   getAllProductsByName(name: any): Observable<any> {
//     return this.http.get(BASIC_URL + `api/customer/search/${name}`, {
//       headers: this.createAuthorizationHeader(),
//     });
//   }

//   addToCart(productId: any): Observable<any> {
//     const cartDto = {
//       productId: productId,
//       userId: UserStorageService.getUserId()
//     };
//     return this.http.post(BASIC_URL + 'api/customer/cart', cartDto, {
//       headers: this.createAuthorizationHeader(),
//     });
//   }

//   increaseProductQuantity(productId: any): Observable<any> {
//     const userId = UserStorageService.getUserId();
//     console.log("service uid", userId);

//     return this.http.post(`${BASIC_URL}api/customer/cart/increase/${userId}/${productId}`,
//       {},
//       { headers: this.createAuthorizationHeader() }
//     );
//   }

//   decreaseProductQuantity(productId: number): Observable<any> {
//     const userId = UserStorageService.getUserId();

//     console.log("service uid", userId);
//     return this.http.post(`${BASIC_URL}api/customer/cart/decrease/${userId}/${productId}`,
//       {},
//       { headers: this.createAuthorizationHeader() }
//     );
//   }
//   getCartByUserId(): Observable<any> {
//     const userId = UserStorageService.getUserId();
//     return this.http.get(BASIC_URL + `api/customer/cart/${userId}`, {
//       headers: this.createAuthorizationHeader(),
//     });
//   }

//   applyCoupon(code: string): Observable<any> {
//     const userId = UserStorageService.getUserId();
//     return this.http.get(`${BASIC_URL}api/customer/coupon/${userId}/${code}`, {
//       headers: this.createAuthorizationHeader(),
//     });
//   }

//   placeOrder(orderDto: any): Observable<any> {
//     orderDto.userId = UserStorageService.getUserId();
//     return this.http.post(BASIC_URL + `api/customer/placeOrder`, orderDto, {
//       headers: this.createAuthorizationHeader(),
//     });
//   }

//   getOrderByUserId(): Observable<any> {
//     const userId = UserStorageService.getUserId();
//     return this.http.get(BASIC_URL + `api/customer/myOrders/${userId}`, {
//       headers: this.createAuthorizationHeader(),
//     });
//   }

//   getOrderedProducts(orderId: number): Observable<any> {
//     return this.http.get(BASIC_URL + `api/customer/ordered-products/${orderId}`, {
//       headers: this.createAuthorizationHeader(),
//     });
//   }


//   giveReview(formData: FormData): Observable<any> {
//     console.log("📌 giveReview service called");
//     return this.http.post(BASIC_URL + `api/customer/review`, formData, {
//       headers: this.createAuthorizationHeader()
//     });
//   }




//   addProductToWishlist(wishListDto: any): Observable<any> {
//     return this.http.post(BASIC_URL + `api/customer/wishlist`, wishListDto, {
//       headers: this.createAuthorizationHeader(),
//     });
//   }

//   getWishlistByUserId(): Observable<any> {
//     const userId = UserStorageService.getUserId();
//     return this.http.get(BASIC_URL + `api/customer/wishlist/${userId}`, {
//       headers: this.createAuthorizationHeader(),
//     });
//   }

//   getProductDetailById(productId: number): Observable<any> {
//     return this.http.get(BASIC_URL + `api/customer/product/${productId}`, {
//       headers: this.createAuthorizationHeader(),
//     });
//   }


//   removeProductFromWishlist(userId: number, productId: number) {
//     const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
//     return this.http.delete(`${this.BASE_URL}/wishlist/${userId}/${productId}`, { headers });
//   }





//   private createAuthorizationHeader(): HttpHeaders {
//     return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken());
//   }
// }


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from '../../services/storage/user-storage.service';

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

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken());
  }
}
