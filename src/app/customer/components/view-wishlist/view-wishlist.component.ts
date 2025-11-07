import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Component({
  selector: 'app-view-wishlist',
  templateUrl: './view-wishlist.component.html',
  styleUrls: ['./view-wishlist.component.scss']
})
export class ViewWishlistComponent {

  products: any[] = [];

  constructor(
    private customerService: CustomerService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getWishlistByUserId();
  }

  getWishlistByUserId() {
    this.products = [];
    this.customerService.getWishlistByUserId().subscribe(res => {
      if (res && res.length > 0) {
        res.forEach(element => {
          element.processedImg = 'data:image/jpeg;base64,' + element.returnedImg;
          this.products.push(element);
        });
        console.log("products", this.products);
      } else {
        // Empty wishlist case handled by template
        console.log("Wishlist is empty");
      }
    });
  }

  removeFromWishlist(wishlistId: number) {
    console.log("products", this.products);
    console.log("wishlistId", wishlistId);

    const userId = UserStorageService.getUser()?.userId;

    this.customerService.removeProductFromWishlist(userId, wishlistId).subscribe({
      next: () => {
        this.snackbar.open("Removed from wishlist", "Close", { duration: 3000 });
        this.getWishlistByUserId(); // refresh list
      },
      error: (err) => {
        console.error("Error removing from wishlist:", err);
        this.snackbar.open("Error removing wishlist", "Close", { duration: 3000 });
      }
    });
  }
}
