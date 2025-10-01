import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-view-ordered-products',
  templateUrl: './view-ordered-products.component.html',
  styleUrls: ['./view-ordered-products.component.scss']
})
export class ViewOrderedProductsComponent implements OnInit {

  orderId: any;
  orderedProductDetailsList: any[] = [];
  totalAmount: any;

  constructor(
    private activatedroute: ActivatedRoute,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.orderId = this.activatedroute.snapshot.params['orderId']; // ✅ Move here
    this.getOrderedProductsDetailsByOrderId();
  }

  getOrderedProductsDetailsByOrderId() {
    this.customerService.getOrderedProducts(this.orderId).subscribe(res => {
      if (res && res.productDtoList) {
        this.orderedProductDetailsList = res.productDtoList.map(element => {
          element.processedImg = 'data:image/jpeg;base64,' + element.byteImg; // ✅ fixed syntax
          return element;
        });
      }
      this.totalAmount = res.orderAmount;
    }, error => {
      console.error("Error fetching ordered products:", error);
    });
  }
}
