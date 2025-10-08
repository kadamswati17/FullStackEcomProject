


import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { PlaceOrderComponent } from '../place-order/place-order.component';
import { error, log } from 'node:console';
import { CouponsComponent } from '../../../admin/components/coupons/coupons.component';
// import { PlaceOrderComponent } from '../../../admin/components/place-order/place-order.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  cartItems: any[] = [];   // 👈 changed to camelCase
  order: any;

  couponForm!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.couponForm = this.fb.group({
      code: [null, [Validators.required]]
    })
    this.getCart();
  }





  applyCoupon() {
    this.customerService.applyCoupon(this.couponForm.get(['code'])!.value).subscribe(res => {
      this.snackbar.open("Coupon AppliedmSuccessfully", 'close', {
        duration: 5000
      });
      this.getCart();
    }, error => {
      this.snackbar.open(error.error, 'Close', {
        duration: 5000
      });
    }

    )
  }

  getCart() {
    this.cartItems = [];   // 👈 updated
    this.customerService.getCartByUserId().subscribe(res => {
      this.order = res;
      res.cartItems.forEach((element: any) => {
        element.processedImg = 'data:image/jpeg;base64,' + element.returnedImg;
        this.cartItems.push(element);  // 👈 updated
      });
    });

    console.log(this.cartItems);

  }




  increaseQuantity(productId: any) {
    console.log("Increasing quantity for productId:", productId);

    if (!productId) {
      console.error("Product ID is undefined!");
      return;
    }

    this.customerService.increaseProductQuantity(productId).subscribe({
      next: (res) => {
        console.log("Quantity increased", res);
        this.snackbar.open('Product quantity increased.', 'Close', { duration: 500 });
        this.getCart();
      },
      error: (err) => {
        console.error("Error increasing quantity", err);
        this.snackbar.open('Error increasing quantity.', 'Close', { duration: 3500 });
      }
    });
  }

  decreaseQuantity(productId: any) {
    console.log(" Decreasing quantity for productId:", productId);

    if (!productId) {
      console.error("Product ID is undefined!");
      return;
    }

    this.customerService.decreaseProductQuantity(productId).subscribe({
      next: (res) => {
        console.log("Quantity decreased", res);
        this.snackbar.open('Product quantity decreased.', 'Close', { duration: 500 });
        this.getCart();
      },
      error: (err) => {
        console.error("Error decreasing quantity", err);
        this.snackbar.open('Error decreasing quantity.', 'Close', { duration: 3500 });
      }
    });
  }

  placeOrder() {
    this.dialog.open(PlaceOrderComponent);
  }

  openCoupenModal(): void {
    const dialogRef = this.dialog.open(CouponsComponent, {
      width: '550px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((selectedCoupon) => {
      if (selectedCoupon) {
        console.log("Selected Coupon:", selectedCoupon);
        this.couponForm.patchValue({ code: selectedCoupon.code }); // Auto-fill coupon code
      }
    });
  }

}