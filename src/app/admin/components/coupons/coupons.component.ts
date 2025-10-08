import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PostCouponComponent } from '../post-coupon/post-coupon.component';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent {
  coupons: any;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CouponsComponent>
  ) { }

  ngOnInit() {
    this.getCoupons();
  }

  getCoupons() {
    this.adminService.getCoupon().subscribe(res => {
      this.coupons = res;
    });
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
    this.dialogRef.close(coupon); // Pass coupon back to CartComponent
  }
}
