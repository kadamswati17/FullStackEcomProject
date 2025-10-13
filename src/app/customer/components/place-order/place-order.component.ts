import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../../customer/services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent {

  orderForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private customerService: CustomerService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.orderForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      mobile: [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [null, [Validators.required]],
      pincode: [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      orderDescription: [null]
    });
  }

  placeOrder() {
    if (this.orderForm.invalid) return;

    this.customerService.placeOrder(this.orderForm.value).subscribe({
      next: (res) => {
        if (res.id != null) {
          this.snackBar.open("Order placed Successfully", "close", { duration: 5000 });
          this.dialog.closeAll();
          setTimeout(() => {
            // this.router.navigateByUrl("/orders");
            this.router.navigateByUrl("/customer/my-orders");
          }, 500);
        } else {
          this.snackBar.open("Something went wrong", "close", { duration: 5000 });
        }
      },
      error: () => {
        this.snackBar.open("Failed to place order", "close", { duration: 5000 });
      }
    });
  }

  closeForm() {
    this.dialog.closeAll();
  }

}
