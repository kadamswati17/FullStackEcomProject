import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent {
  myOrders: any[] = [];
  displayedColumns: string[] = [
    'userName',
    'trackingId',
    'amount',
    'orderDescription',
    'address',
    'date',
    'orderStatus',
    'action'
  ];

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.getMyOrders();
  }

  getMyOrders() {
    this.customerService.getOrderByUserId().subscribe(res => {
      this.myOrders = res;
      console.log("this.myOrders", this.myOrders);
    });
  }
}
