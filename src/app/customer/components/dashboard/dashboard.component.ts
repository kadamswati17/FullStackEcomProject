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

  categories: any[] = []; // For category list in sidebar
  selectedCategory: string | null = null;

  allProducts: any[] = []; // Store all products for filtering
  products: any[] = []; // Current displayed products

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
    this.loadCategories(); // Load categories on init

    this.searchProductForm.get('title')?.valueChanges.subscribe(value => {
      if (!value?.trim()) this.getAllProducts();
    });
  }

  // ==========================
  // Existing Product / Wishlist / Cart Functionality
  // ==========================

  getAllProducts() {
    this.customerService.getAllProducts().subscribe(res => {
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
      });

      this.allProducts = res; // Save all products
      this.products = [...this.allProducts]; // Display all by default

      // Group products by category
      const grouped = new Map<string, any[]>();
      this.allProducts.forEach(element => {
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

  submitForm() {
    const title = this.searchProductForm.get('title')?.value;
    console.log('Searching for:', title);
    if (!title) {
      this.getAllProducts();
      return;
    }
    this.customerService.getAllProductsByName(title).subscribe(res => {
      res.forEach(element => element.processedImg = 'data:image/jpeg;base64,' + element.byteImg);
      this.groupedProducts = [{ name: 'Search Results', products: res }];
      this.products = res; // Update current displayed products
    });
  }

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

  // ==========================
  // Category Functionality
  // ==========================
  loadCategories() {
    this.customerService.getAllCategories().subscribe({
      next: (res: any[]) => {
        this.categories = res;
      },
      error: (err) => {
        console.error('Error fetching categories', err);
        this.snackbar.open('Failed to load categories', 'Close', { duration: 5000 });
      }
    });
  }
  selectCategory(categoryName: string | null) {
    this.selectedCategory = categoryName;
    console.log('Selected category:', categoryName);

    // Filter products by category and rebuild groupedProducts
    this.groupedProducts = this.buildGroupedProducts(categoryName);
  }

  private buildGroupedProducts(categoryName: string | null) {
    let filtered = this.allProducts;
    if (categoryName) {
      filtered = this.allProducts.filter(p => p.categoryName === categoryName);
    }

    const grouped = new Map<string, any[]>();
    filtered.forEach(element => {
      const category = element.categoryName || 'Others';
      if (!grouped.has(category)) grouped.set(category, []);
      grouped.get(category)!.push(element);
    });

    return Array.from(grouped.entries()).map(([name, products]) => ({ name, products }));
  }
  // shareProduct(product: any) {
  //   const message = `Check out this product: ${product.name}\nPrice: ₹${product.price}`;
  //   const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  //   window.open(whatsappUrl, "_blank");
  // }

  // shareProduct(product: any) {
  //   const message = `Check out this product: ${product.name}\nPrice: ₹${product.price}`;

  //   // If the mobile device supports native sharing
  //   if (navigator.share) {
  //     navigator.share({
  //       title: product.name,
  //       text: message,
  //     }).catch((err) => console.log("Share cancelled:", err));
  //   }
  //   else {
  //     // Fallback for browsers that don't support native share
  //     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  //     window.open(whatsappUrl, "_blank");
  //   }
  // }
  shareProduct(product: any) {
    const productUrl = `https://yourwebsite.com/product/${product.id}`;

    const message = `Check out this product:\n${productUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  }




}
