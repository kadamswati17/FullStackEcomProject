import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  searchProductForm!: FormGroup;
  wishlistProducts: Set<number> = new Set(); // Track wishlist products
  groupedProducts: any[] = []; // Category grouped products

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]]
    });

    this.getAllProducts();
    this.loadUserWishlist();
  }

  // Fetch all products & group by category
  getAllProducts() {
    this.customerService.getAllProducts().subscribe(res => {
      const grouped = new Map<string, any[]>();
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        const category = element.categoryName || 'Others';
        if (!grouped.has(category)) grouped.set(category, []);
        grouped.get(category)!.push(element);
      });
      this.groupedProducts = Array.from(grouped.entries()).map(([name, products]) => ({
        name,
        products
      }));
    });
  }

  // Search products
  submitForm() {
    const title = this.searchProductForm.get('title')?.value;
    this.customerService.getAllProductsByName(title).subscribe(res => {
      res.forEach(element => element.processedImg = 'data:image/jpeg;base64,' + element.byteImg);
      this.groupedProducts = [{ name: 'Search Results', products: res }];
    });
  }

  // Add to cart
  addToCart(product: any) {
    const userId = UserStorageService.getUser()?.userId;
    if (!userId) {
      this.snackbar.open('User not logged in', 'Close', { duration: 5000 });
      return;
    }
    const productId = product?.id ?? product?.productId;
    if (!productId) return;

    const cartDto = { productId, userId };
    this.customerService.addToCart(cartDto).subscribe({
      next: () => this.snackbar.open('Product added to cart successfully', 'Close', { duration: 5000 }),
      error: () => this.snackbar.open('Failed to add product to cart', 'Close', { duration: 5000 })
    });
  }

  // Wishlist operations
  addToWishlist(product: any) {
    const userId = UserStorageService.getUser()?.userId;
    const productId = product?.id ?? product?.productId;
    if (!userId || !productId) return;

    const wishListDto = { productId, userId };
    this.customerService.addProductToWishlist(wishListDto).subscribe({
      next: (res) => {
        if (res.id != null) this.wishlistProducts.add(productId);
      }
    });
  }

  removeFromWishlist(productId: number) {
    const userId = UserStorageService.getUser()?.userId;
    if (!userId) return;

    this.customerService.removeProductFromWishlist(userId, productId).subscribe(() => {
      this.wishlistProducts.delete(productId);
    });
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProducts.has(productId);
  }

  toggleWishlist(product: any) {
    const productId = product?.id ?? product?.productId;
    if (!productId) return;
    this.isInWishlist(productId) ? this.removeFromWishlist(productId) : this.addToWishlist(product);
  }

  loadUserWishlist() {
    this.customerService.getWishlistByUserId().subscribe(res => {
      res.forEach((item: any) => this.wishlistProducts.add(item.productId));
    });
  }
}
