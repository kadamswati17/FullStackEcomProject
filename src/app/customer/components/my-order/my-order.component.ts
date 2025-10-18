import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewOrderedProductComponent } from '../review-ordered-product/review-ordered-product.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent implements OnInit {
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
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.getMyOrders();
  }

  getMyOrders() {
    this.customerService.getOrderByUserId().subscribe({
      next: (res) => {
        this.myOrders = res.sort((a: any, b: any) => b.id - a.id);
        console.log("📦 Sorted Orders:", this.myOrders);
      },
      error: (err) => {
        console.error("❌ Error fetching orders:", err);
      }
    });
  }

  viewOrderDetails(orderId: number) {
    this.router.navigate(['/order', orderId]); // match the route path
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
        console.log('✅ Review submitted, refreshing...');
      }
    });
  }

  cartItems: any[] = [];
  order: any;


  getOrderDetailsByIdts(orderId: number) {

    this.cartItems = [];   // 👈 updated
    this.order = 1;
    this.customerService.getOrderDetailsById(orderId).subscribe(res => {
      this.cartItems = res.data;

      console.log("this.cartItems");
      console.log(this.cartItems);

      // res.cartItems.forEach((element: any) => {
      //   element.processedImg = 'data:image/jpeg;base64,' + element.returnedImg;
      //   this.cartItems.push(element);  // 👈 updated
      // });
    });
  }
}
