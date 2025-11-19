import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASIC_URL = 'http://localhost:8080/api/admin';


export class CartItem {
  id?: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
  productImg?: string;

  constructor(init?: Partial<CartItem>) {
    Object.assign(this, init);
  }
}

export interface PlacePurchaseOrderDto {
  id?: number;
  userId: number;
  userName?: string;
  trackingId?: string;
  amount?: number;
  orderDescription?: string;
  address?: string;
  email?: string;
  mobile?: string;
  pincode?: string;
  orderStatus?: string;
  date?: string;
  cartItems?: CartItem[];
}

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  constructor(private http: HttpClient) { }

  // Get all cart items
  getCartItems() {
    return this.http.get<CartItem[]>(`${BASIC_URL}/purchase-cart`);
  }

  // Clear all cart items
  clearCartItems() {
    return this.http.delete(`${BASIC_URL}/purchase-cart/clear`);
  }

  // Angular service
  deleteCartItem(cartItemId: number) {
    console.log("Deleting cart item with ID:", cartItemId);
    return this.http.delete(`${BASIC_URL}/purchase-cart/${cartItemId}`);
  }

  updateCartItem(item: CartItem): Observable<any> {
    return this.http.put(`${BASIC_URL}/purchase-cart/${item.id}`, item);
  }

  saveCartItem(item: CartItem): Observable<any> {
    return this.http.post(`${BASIC_URL}/purchase-cart`, item);
  }

  getItemsByOrder(orderId: number) {
    return this.http.get(`${BASIC_URL}/purchase-cart/${orderId}`);
  }

  placeOrder(dto: PlacePurchaseOrderDto) {
    return this.http.post(`${BASIC_URL}/purchase-order/place`, dto);
  }

  clearCartByOrder(orderId: number) {
    return this.http.delete(`${BASIC_URL}/purchase-cart/order/${orderId}`);
  }

  getPurchaseOrders(): Observable<PlacePurchaseOrderDto[]> {
    return this.http.get<PlacePurchaseOrderDto[]>(`${BASIC_URL}/purchase-orders`);
  }

  // Optional: user-specific orders
  getPurchaseOrdersByUser(userId: number): Observable<PlacePurchaseOrderDto[]> {
    return this.http.get<PlacePurchaseOrderDto[]>(`${BASIC_URL}/purchase-orders/user/${userId}`);
  }

  changeOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${BASIC_URL}/purchase-order/status/${orderId}?status=${status}`, {});
  }

  getPurchaseOrderDetails(orderId: number): Observable<PlacePurchaseOrderDto> {
    return this.http.get<PlacePurchaseOrderDto>(
      `${BASIC_URL}/purchase-order/details/${orderId}`
    );
  }

}

