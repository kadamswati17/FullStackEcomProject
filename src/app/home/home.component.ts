import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CustomerService } from '../customer/services/customer.service';
import { UserStorageService } from '../services/storage/user-storage.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  groupedProducts: { name: string, products: any[] }[] = [];
  searchProductForm!: FormGroup;
  wishlistProducts: Set<number> = new Set();
  selectedCategory: string | null = null;
  allProducts: any[] = [];

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router,
    private appComponent: AppComponent
  ) { }

  ngOnInit(): void {
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]]
    });

    // Listen for category selection from sidebar
    this.appComponent.categorySelected.subscribe((category: string | null) => {
      this.selectedCategory = category;
      this.applyCategoryFilter();
    });

    this.getAllProducts();

    this.searchProductForm.get('title')?.valueChanges.subscribe(value => {
      if (!value) this.applyCategoryFilter();
      else this.search(value);
    });
    this.searchProductForm.get('title')?.valueChanges.subscribe(value => {
      if (!value?.trim()) this.getAllProducts();
    });
  }

  // getAllProducts() {
  //   this.products = [];
  //   this.customerService.getAllProducts().subscribe(res => {
  //     res.forEach(product => {
  //       product.processedImg = 'data:image/jpeg;base64,' + product.byteImg;
  //       this.products.push(product);
  //     });
  //     this.allProducts = [...this.products];
  //     this.applyCategoryFilter();
  //   });
  // }

  getAllProducts() {
    this.products = [];
    this.customerService.getAllProducts().subscribe(res => {
      res.forEach(product => {
        console.log('Product Category:', product); // Debug log
        product.processedImg = 'data:image/jpeg;base64,' + product.byteImg;
        this.products.push(product);
      });
      this.allProducts = [...this.products];

      // Set default selected category to the first category (Sofa)
      if (!this.selectedCategory && this.allProducts.length > 0) {
        const firstCategory = this.allProducts[0].categoryName;
        this.selectedCategory = firstCategory;
      }

      this.applyCategoryFilter();
    });
  }

  applyCategoryFilter() {
    let filteredProducts = this.allProducts;
    if (this.selectedCategory) {
      filteredProducts = filteredProducts.filter(p => p.categoryName === this.selectedCategory);
    }

    const groups: { [key: string]: any[] } = {};
    filteredProducts.forEach(product => {
      if (!groups[product.categoryName]) groups[product.categoryName] = [];
      groups[product.categoryName].push(product);
    });
    this.groupedProducts = Object.keys(groups).map(key => ({
      name: key,
      products: groups[key]
    }));
  }

  submitForm() {
    const title = this.searchProductForm.get('title')?.value?.trim();
    this.customerService.getAllProductsByName(title).subscribe(res => {
      res.forEach(product => {
        product.processedImg = 'data:image/jpeg;base64,' + product.byteImg;
      });
      this.allProducts = [...res];
      this.applyCategoryFilter();
    });
  }

  // ✅ Add to Cart with login check
  addToCart(productId: any) {
    const user = UserStorageService.getUser();

    if (!user) {
      this.snackbar.open('Please login to add items to your cart', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    this.customerService.addToCart(productId).subscribe({
      next: () => {
        this.snackbar.open('Product added to cart successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.snackbar.open('Something went wrong', 'Close', { duration: 3000 });
      }
    });
  }

  // ✅ Add to Wishlist with login check
  addToWishlist(productId: any) {
    const user = UserStorageService.getUser();

    if (!user) {
      this.snackbar.open('Please login to add items to your wishlist', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    const wishListDto = {
      productId: productId,
      userId: user.userId
    };
    this.customerService.addProductToWishlist(wishListDto).subscribe({
      next: (res) => {
        if (res.id != null) {
          this.snackbar.open('Product added to Wishlist successfully', 'Close', { duration: 3000 });
          this.wishlistProducts.add(productId);
        } else {
          this.snackbar.open('Already in Wishlist', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Error adding to wishlist:', err);
        this.snackbar.open('Something went wrong', 'Close', { duration: 3000 });
      }
    });
  }

  toggleWishlist(productId: number) {
    if (this.wishlistProducts.has(productId)) {
      this.wishlistProducts.delete(productId);
    } else {
      this.addToWishlist(productId);
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProducts.has(productId);
  }

  search(value: string) {
    if (!value) return this.applyCategoryFilter();
    const filtered = this.allProducts.filter(p => p.name.toLowerCase().includes(value.toLowerCase()));
    this.allProducts = [...filtered];
    this.applyCategoryFilter();
  }

  shareProduct(product: any) {

    // 1️⃣ Check if user is logged in (same logic as heart icon)
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      // User not logged in → redirect to login
      this.router.navigate(['/login']);
      return;
    }

    // 2️⃣ If logged in → Share on WhatsApp
    const productUrl = `http://localhost:4200/product-details/${product.id}`;
    const message = `Check out this product:\n${productUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }

}
