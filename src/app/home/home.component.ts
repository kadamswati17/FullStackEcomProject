import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../customer/services/customer.service';
import { UserStorageService } from '../services/storage/user-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  products: any[] = [];
  groupedProducts: { name: string, products: any[] }[] = [];
  searchProductForm!: FormGroup;
  wishlistProducts: Set<number> = new Set();

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

    this.searchProductForm.get('title')?.valueChanges.subscribe(value => {
      if (!value) this.getAllProducts();
      else this.search(value);
    });
  }

  getAllProducts() {
    this.products = [];
    this.customerService.getAllProducts().subscribe(res => {
      res.forEach(product => {
        product.processedImg = 'data:image/jpeg;base64,' + product.byteImg;
        this.products.push(product);
      });
      this.groupByCategory();
    });
  }

  groupByCategory() {
    const groups: { [key: string]: any[] } = {};
    this.products.forEach(product => {
      if (!groups[product.categoryName]) groups[product.categoryName] = [];
      groups[product.categoryName].push(product);
    });
    this.groupedProducts = Object.keys(groups).map(key => ({
      name: key,
      products: groups[key]
    }));
  }

  submitForm() {
    const title = this.searchProductForm.get('title')?.value;
    this.products = [];
    this.customerService.getAllProductsByName(title).subscribe(res => {
      res.forEach(product => {
        product.processedImg = 'data:image/jpeg;base64,' + product.byteImg;
        this.products.push(product);
      });
      this.groupByCategory();
    });
  }

  addToCart(productId: any) {
    this.customerService.addToCart(productId).subscribe(res => {
      this.snackbar.open('Product added to cart successfully', 'Close', { duration: 5000 });
    });
  }

  addToWishlist(productId: any) {
    const wishListDto = {
      productId: productId,
      userId: UserStorageService.getUser()?.userId
    };
    this.customerService.addProductToWishlist(wishListDto).subscribe({
      next: (res) => {
        if (res.id != null) {
          this.snackbar.open('Product added to Wishlist successfully', 'Close', { duration: 5000 });
          this.wishlistProducts.add(productId);
        } else {
          this.snackbar.open("Already in Wishlist", 'Error', { duration: 5000 });
        }
      },
      error: (err) => {
        console.error("Error adding to wishlist:", err);
        this.snackbar.open("Something went wrong", 'Error', { duration: 5000 });
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
    if (!value) return this.getAllProducts();
    const filtered = this.products.filter(p => p.name.toLowerCase().includes(value.toLowerCase()));
    this.products = filtered;
    this.groupByCategory();
  }
}
