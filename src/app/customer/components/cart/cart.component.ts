import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    const code = this.couponForm.get('code')?.value;

    if (!code) {
      this.snackbar.open("Please enter a coupon code", 'Close', { duration: 3000 });
      return;
    }

    this.customerService.applyCoupon(code).subscribe({
      next: (res) => {
        this.snackbar.open("Coupon applied successfully", 'Close', { duration: 5000 });
      },
      error: () => {
        this.snackbar.open("Invalid coupon code", 'Close', { duration: 3000 });
      }
    });
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
  }
}
