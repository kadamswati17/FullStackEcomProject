import { Component, Inject, Optional } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostCouponComponent } from '../post-coupon/post-coupon.component';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { CustomerService } from '../../../customer/services/customer.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent {
  coupons: any;
  isAdmin: boolean = UserStorageService.getUserRole() === 'ADMIN';

  constructor(
    private adminService: AdminService,
    private customerService: CustomerService,
    private dialog: MatDialog,
    @Optional() private dialogRef?: MatDialogRef<CouponsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) { }

  ngOnInit() {
    this.getCoupons();
  }

  getCoupons() {
    if (this.isAdmin) {
      // Admin can view all coupons
      this.adminService.getCoupon().subscribe({
        next: (res) => (this.coupons = res),
        error: (err) => console.error('Error fetching admin coupons:', err),
      });
    } else {
      // Customer can view public coupons
      this.customerService.getCouponsForCustomer().subscribe({
        next: (res) => (this.coupons = res),
        error: (err) => console.error('Error fetching customer coupons:', err),
      });
    }
  }

  openAddCouponModal() {
    const dialogRef = this.dialog.open(PostCouponComponent, {
      width: '600px',
      disableClose: true,
      panelClass: 'custom-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.getCoupons();
      }
    });
  }

  selectCoupon(coupon: any) {
    if (this.dialogRef) {
      this.dialogRef.close(coupon);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
