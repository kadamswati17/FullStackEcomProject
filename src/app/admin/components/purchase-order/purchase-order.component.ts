import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth-service';
import { CartItem, PlacePurchaseOrderDto, PurchaseService } from '../../service/purchase.service';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {

  // --------------------- Cart ---------------------
  cartItems: CartItem[] = [];
  totalAmount = 0;

  cartForm: FormGroup;
  parents: any[] = [];
  products: any[] = [];
  selectedParentId: number | null = null;
  selectedProduct: any = null;
  dateValue: string = '';
  productPrice: number = 0;

  // --------------------- Orders ---------------------
  myOrders: PlacePurchaseOrderDto[] = [];
  selectedOrder: PlacePurchaseOrderDto | null = null;
  displayedColumns: string[] = [
    'id', 'userName', 'trackingId', 'amount', 'orderDescription', 'address', 'date', 'orderStatus', 'action'
  ];

  // --------------------- UI State ---------------------
  showOrderForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private purchaseService: PurchaseService,
    private adminService: AdminService,
  ) {
    this.cartForm = this.fb.group({
      parent: [null, Validators.required],
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {

    this.loadParents();
    this.loadOrders();
    this.dateValue = new Date().toISOString().substring(0, 10);
  }


  // --------------------- Parent & Product ---------------------
  loadParents() {
    this.authService.getAllUsers().subscribe((res: any[]) => {
      this.parents = res.filter(u => u.userRole && u.userRole.toLowerCase() === 'parent_admin');
    });
  }

  onParentChange(ev: any) {
    const parentId = +ev.target.value;
    this.selectedParentId = parentId;

    if (!parentId) {
      this.products = [];
      return;
    }

    this.products = [];
    this.adminService.getAllProductsByUserId(parentId).subscribe(res => {
      res.forEach(prod => {
        prod.processedImg = 'data:image/jpeg;base64,' + prod.byteImg;
        this.products.push(prod);
        this.loadCartItems();
      });
    });
  }

  onProductChange(ev: any) {
    this.productPrice = 0;
    const productId = +ev.target.value;

    this.selectedProduct = this.products.find(p => p.productId === productId);
    this.productPrice = this.selectedProduct ? this.selectedProduct.price : 0;
  }


  loadCartItems() {
    this.purchaseService.getCartItems().subscribe({
      next: (res: CartItem[]) => {
        this.cartItems = res.map(item => {
          item.total = item.price * item.quantity;
          return item;
        });
        this.recalculateTotal();
      },
      error: err => console.error('Failed to load cart', err)
    });
  }

  // --------------------- Cart ---------------------
  addToCart() {
    console.log('Adding to cart', this.selectedProduct);
    if (!this.selectedProduct || !this.selectedParentId) return;

    const quantity = +this.cartForm.get('quantity')!.value;
    const price = this.productPrice;

    // Check if the product is already in the cart
    const existingItem = this.cartItems.find(
      item => item.productId === (this.selectedProduct.productId || this.selectedProduct.id)
    );

    if (existingItem) {
      // Update existing item's quantity and total
      existingItem.quantity += quantity;
      existingItem.total = existingItem.price * existingItem.quantity;

      // Update in backend
      this.purchaseService.updateCartItem(existingItem).subscribe({
        next: res => {
          if (res && res.id) existingItem.id = res.id;
        },
        error: err => console.error('Failed to update cart item', err)
      });

    } else {
      // Add new item to cart
      const item = new CartItem({
        productId: this.selectedProduct.productId || this.selectedProduct.id,
        productName: this.selectedProduct.name || this.selectedProduct.productName,
        price,
        quantity,
        total: price * quantity
      });

      this.cartItems.push(item);

      // Save to backend
      this.purchaseService.saveCartItem(item).subscribe({
        next: res => {
          if (res && res.id) item.id = res.id;
        },
        error: err => console.error('Failed to save cart item', err)
      });
    }

    this.recalculateTotal();

    // Reset form for next product
    this.cartForm.patchValue({ productId: null, quantity: 1 });
    this.selectedProduct = null;
  }


  recalculateTotal() {
    this.totalAmount = this.cartItems.reduce((acc, cur) => acc + cur.total, 0);
  }

  removeItem(i: number) {
    this.purchaseService.deleteCartItem(this.cartItems[i].id!).subscribe({
      next: () => {
        this.cartItems.splice(i, 1);
        this.recalculateTotal();
      },
      error: err => console.error('Failed to delete cart item', err)
    });
  }

  // --------------------- Place Order ---------------------
  placeOrder() {
    if (!this.selectedParentId) {
      alert('Select supplier (parent) before placing order');
      return;
    }

    if (this.cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }

    const dto: PlacePurchaseOrderDto = {
      userId: this.selectedParentId,
      address: '',
      email: '',
      mobile: '',
      pincode: '',
      orderDescription: '',
      cartItems: this.cartItems,
      date: this.dateValue
    };

    this.purchaseService.placeOrder(dto).subscribe({
      next: () => {
        // Delete cart items from backend
        this.purchaseService.clearCartItems().subscribe({
          next: () => {
            this.cartItems = [];
            this.totalAmount = 0;
            alert('Order placed successfully');
            this.loadOrders();
            this.showOrderForm = false;
          },
          error: err => console.error('Failed to clear cart', err)
        });
      },
      error: (err) => {
        alert('Order failed: ' + (err?.error?.message || err.message));
      }
    });
  }


  // --------------------- Orders ---------------------
  loadOrders() {
    this.purchaseService.getPurchaseOrders().subscribe({
      // next: res => this.myOrders = res,
      next: res => this.myOrders = res.reverse(),
      error: err => console.error('Failed to load orders', err)
    });
  }

  viewOrder(order: PlacePurchaseOrderDto) {
    this.selectedOrder = order;
  }

  // --------------------- Change Order Status ---------------------
  changeOrderStatus(orderId: number, status: string) {
    this.purchaseService.changeOrderStatus(orderId, status).subscribe({
      next: () => {
        alert('Order status updated');
        this.loadOrders();
      },
      error: err => alert('Failed to update order status: ' + (err?.error?.message || err.message))
    });
  }

  // --------------------- Toggle Form ---------------------
  toggleOrderForm() {
    this.showOrderForm = !this.showOrderForm;
  }
}
