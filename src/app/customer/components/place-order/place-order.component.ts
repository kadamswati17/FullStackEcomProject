import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../../customer/services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { AuthService } from '../../../services/auth/auth-service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent implements OnInit {

  orderForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.orderForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      mobile: [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [null, [Validators.required]],
      pincode: [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      orderDescription: [null]
    });

    // Get userId from stored user
    const user = UserStorageService.getUser();
    if (user && user.userId) {
      // Call API to get latest user info
      this.authService.getUserInfo(user.userId).subscribe({
        next: (res) => {
          console.log(res);
          // Patch form with latest info
          this.orderForm.patchValue({
            name: res.name || '',
            email: res.email || ''
          });
        },
        error: () => {
          console.warn("Failed to fetch user info from API, using stored info");
          this.orderForm.patchValue({
            name: user.name || '',
            email: user.email || ''
          });
        }
      });
    } else {
      // fallback to stored info
      if (user) {
        this.orderForm.patchValue({
          name: user.name || '',
          email: user.email || ''
        });
      }
    }
  }

  placeOrder() {
    if (this.orderForm.invalid) return;

    this.customerService.placeOrder(this.orderForm.value).subscribe({
      next: (res) => {
        if (res.id != null) {
          this.snackBar.open("Order placed successfully!", "close", { duration: 3000 });
          this.dialog.closeAll();

          // ✅ Redirect immediately to "My Orders" page
          this.router.navigate(['/customer/orders']);
        } else {
          this.snackBar.open("Something went wrong", "close", { duration: 3000 });
        }
      },
      error: () => {
        this.snackBar.open("Failed to place order", "close", { duration: 3000 });
      }
    });
  }

  closeForm() {
    this.dialog.closeAll();
  }

}
