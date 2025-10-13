// import { Component } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { AdminService } from '../../../admin/service/admin.service';
// import { CustomerService } from '../../services/customer.service';
// import { UserStorageService } from '../../../services/storage/user-storage.service';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss']
// })
// export class DashboardComponent {

//   products: any[] = [];
//   searchProductForm!: FormGroup;

//   wishlistProducts: Set<number> = new Set(); // ✅ Add this

//   constructor(private customerService: CustomerService,
//     private fb: FormBuilder,
//     private snackbar: MatSnackBar) { }

//   ngOnInit(): void {
//     this.getAllProducts();

//     this.searchProductForm = this.fb.group({
//       title: [null, [Validators.required]]
//     });
//   }

//   getAllProducts() {
//     this.products = [];
//     this.customerService.getAllProducts().subscribe(res => {
//       res.forEach(element => {
//         element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
//         this.products.push(element);
//       });
//     });
//   }

//   submitForm() {
//     this.products = [];
//     const title = this.searchProductForm.get('title')?.value;
//     this.customerService.getAllProductsByName(title).subscribe(res => {
//       res.forEach(element => {
//         element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
//         this.products.push(element);
//       });
//     });
//   }

//   addToCart(id: any) {
//     this.customerService.addToCart(id).subscribe(res => {
//       this.snackbar.open('Product added to cart successfully', 'Close', {
//         duration: 5000,
//       });
//     });
//   }

//   addToWishlist(productId: any) {
//     const wishListDto = {
//       productId: productId,
//       userId: UserStorageService.getUser()?.userId
//     };

//     this.customerService.addProductToWishlist(wishListDto).subscribe({
//       next: (res) => {
//         if (res.id != null) {
//           this.snackbar.open('Product added to Wishlist successfully', 'Close', { duration: 5000 });
//           this.wishlistProducts.add(productId); // <-- mark as wishlist
//         } else {
//           this.snackbar.open("Already in Wishlist", 'Error', { duration: 5000 });
//         }
//       },
//       error: (err) => {
//         console.error("Error adding to wishlist:", err);
//         this.snackbar.open("Something went wrong", 'Error', { duration: 5000 });
//       }
//     });
//   }

//   isInWishlist(productId: number): boolean {
//     return this.wishlistProducts.has(productId);
//   }

//   toggleWishlist(productId: number) {
//     if (this.isInWishlist(productId)) {
//       this.wishlistProducts.delete(productId);
//       // Optionally call API to remove wishlist
//     } else {
//       this.addToWishlist(productId);
//     }
//   }
// }

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
  wishlistProducts: Set<number> = new Set(); // Track products in wishlist

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
    this.loadUserWishlist(); // Load wishlist on init
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

  // Search products by name
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

  // Add product to cart
  addToCart(productId: any) {
    this.customerService.addToCart(productId).subscribe(() => {
      this.snackbar.open('Product added to cart successfully', 'Close', { duration: 5000 });
    });
  }

  // Add product to wishlist
  addToWishlist(productId: number) {
    const wishListDto = {
      productId: productId,
      userId: UserStorageService.getUser()?.userId
    };

    this.customerService.addProductToWishlist(wishListDto).subscribe({
      next: (res) => {
        if (res.id != null) {
          this.snackbar.open('Product added to Wishlist successfully', 'Close', { duration: 5000 });
          this.wishlistProducts.add(productId); // Update set
        } else {
          this.snackbar.open("Already in Wishlist", 'Close', { duration: 5000 });
        }
      },
      error: (err) => {
        console.error("Error adding to wishlist:", err);
        this.snackbar.open("Something went wrong", 'Close', { duration: 5000 });
      }
    });
  }

  // Remove product from wishlist
  removeFromWishlist(productId: number) {
    const userId = UserStorageService.getUser()?.userId;
    this.customerService.removeProductFromWishlist(userId, productId).subscribe({
      next: () => {
        this.snackbar.open('Product removed from Wishlist', 'Close', { duration: 5000 });
        this.wishlistProducts.delete(productId); // Update set
      },
      error: (err) => {
        console.error("Error removing from wishlist:", err);
        this.snackbar.open("Something went wrong", 'Close', { duration: 5000 });
      }
    });
  }

  // Check if product is in wishlist
  isInWishlist(productId: number): boolean {
    return this.wishlistProducts.has(productId);
  }

  // Toggle wishlist state
  toggleWishlist(productId: number) {
    if (this.isInWishlist(productId)) {
      // If already in wishlist, remove it
      this.removeFromWishlist(productId);
    } else {
      // Else add to wishlist
      this.addToWishlist(productId);
    }
  }

  // Load user's wishlist on init
  loadUserWishlist() {
    this.customerService.getWishlistByUserId().subscribe(res => {
      // Assuming API returns array of wishlist items with productId
      res.forEach((item: any) => this.wishlistProducts.add(item.productId));
    });
  }

}
