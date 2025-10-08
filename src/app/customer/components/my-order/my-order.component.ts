import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewOrderedProductComponent } from '../review-ordered-product/review-ordered-product.component';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent {
  myOrders: any[] = [];
  displayedColumns: string[] = [
    'id',
    'userName',
    'trackingId',
    'amount',
    'orderDescription',
    'address',
    'date',
    'orderStatus',
    'action'
  ];

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getMyOrders();
  }

  getMyOrders() {
    this.customerService.getOrderByUserId().subscribe(res => {
      this.myOrders = res;
      console.log("this.myOrders", this.myOrders);
    });
  }
  openReviewDialog(order: any) {
    const dialogRef = this.dialog.open(ReviewOrderedProductComponent, {
      width: '500px',
      height: '580px',
      disableClose: true,
      data: { productId: order.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'submitted') {
        // You can refresh orders or show a toast
        console.log('✅ Review submitted, refreshing...');
      }
    });
  }
}
