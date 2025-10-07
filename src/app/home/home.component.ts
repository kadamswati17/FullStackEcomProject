import { Component } from '@angular/core';
import { UserStorageService } from '../services/storage/user-storage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../customer/services/customer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  products: any[] = [];
  searchProductForm!: FormGroup;

  wishlistProducts: Set<number> = new Set(); // ✅ Add this

  constructor(private customerService: CustomerService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.getAllProducts();

    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]]
    });
  }

  getAllProducts() {
    this.products = [];
    this.customerService.getAllProducts().subscribe(res => {
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
    });
  }

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

  addToCart(id: any) {
    this.customerService.addToCart(id).subscribe(res => {
      this.snackbar.open('Product added to cart successfully', 'Close', {
        duration: 5000,
      });
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
          this.wishlistProducts.add(productId); // <-- mark as wishlist
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

  isInWishlist(productId: number): boolean {
    return this.wishlistProducts.has(productId);
  }

  toggleWishlist(productId: number) {
    if (this.isInWishlist(productId)) {
      this.wishlistProducts.delete(productId);
      // Optionally call API to remove wishlist
    } else {
      this.addToWishlist(productId);
    }
  }
}
