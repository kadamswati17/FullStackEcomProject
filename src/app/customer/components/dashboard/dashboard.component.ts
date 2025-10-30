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

  products: any[] = [];
  searchProductForm!: FormGroup;
  wishlistProducts: Set<number> = new Set(); // Track wishlist products

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

  // Fetch all products
  getAllProducts() {
    this.products = [];
    this.customerService.getAllProducts().subscribe(res => {
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
    });
  }

  // Search products
  submitForm() {
    this.products = [];
    const title = this.searchProductForm.get('title')?.value;
    this.customerService.getAllProductsByName(title).subscribe(res => {
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
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

    if (!productId) {
      this.snackbar.open('Product ID is missing', 'Close', { duration: 5000 });
      console.error('Product object missing ID:', product);
      return;
    }

    const cartDto = { productId, userId };
    this.customerService.addToCart(cartDto).subscribe({
      next: () => this.snackbar.open('Product added to cart successfully', 'Close', { duration: 5000 }),
      error: (err) => {
        console.error('Add to cart failed:', err);
        this.snackbar.open('Failed to add product to cart', 'Close', { duration: 5000 });
      }
    });
  }

  // Wishlist operations
  addToWishlist(product: any) {
    const userId = UserStorageService.getUser()?.userId;
    const productId = product?.id ?? product?.productId;

    if (!userId || !productId) {
      console.error('Missing userId or productId for wishlist:', { userId, product });
      return;
    }

    const wishListDto = { productId, userId };

    this.customerService.addProductToWishlist(wishListDto).subscribe({
      next: (res) => {
        if (res.id != null) {
          this.snackbar.open('Product added to Wishlist successfully', 'Close', { duration: 5000 });
          this.wishlistProducts.add(productId);
        } else {
          this.snackbar.open('Already in Wishlist', 'Close', { duration: 5000 });
        }
      },
      error: (err) => {
        console.error('Error adding to wishlist:', err);
        this.snackbar.open('Something went wrong', 'Close', { duration: 5000 });
      }
    });
  }

  removeFromWishlist(productId: number) {
    const userId = UserStorageService.getUser()?.userId;
    if (!userId) return;

    this.customerService.removeProductFromWishlist(userId, productId).subscribe({
      next: () => {
        this.snackbar.open('Product removed from Wishlist', 'Close', { duration: 5000 });
        this.wishlistProducts.delete(productId);
      },
      error: (err) => {
        console.error('Error removing from wishlist:', err);
        this.snackbar.open('Something went wrong', 'Close', { duration: 5000 });
      }
    });
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProducts.has(productId);
  }

  toggleWishlist(product: any) {
    const productId = product?.id ?? product?.productId;
    if (!productId) return;

    if (this.isInWishlist(productId)) {
      this.removeFromWishlist(productId);
    } else {
      this.addToWishlist(product);
    }
  }

  loadUserWishlist() {
    this.customerService.getWishlistByUserId().subscribe(res => {
      res.forEach((item: any) => this.wishlistProducts.add(item.productId));
    });
  }
}
