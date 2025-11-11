import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewOrderedProductComponent } from '../review-ordered-product/review-ordered-product.component';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  cartItems: any[] = [];
  order: any;

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
        console.log('📦 Sorted Orders:', this.myOrders);
      },
      error: (err) => {
        console.error('❌ Error fetching orders:', err);
      }
    });
  }

  // viewOrderDetails(orderId: number) {
  //   this.router.navigate(['/order', orderId]); // match the route path
  // }

  getOrderDetailsByIdts(orderId: number) {
    this.cartItems = [];
    this.customerService.getOrderDetailsById(orderId).subscribe({
      next: (res) => {
        this.cartItems = res.data;
        console.log('🧾 Order details:', this.cartItems);
      },
      error: (err) => {
        console.error('❌ Error loading order details:', err);
      }
    });
  }

  openReviewDialog(order: any) {
    const dialogRef = this.dialog.open(ReviewOrderedProductComponent, {
      width: '500px',
      height: '580px',
      disableClose: true,
      data: { productId: order.id },
      panelClass: 'custom-review-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'submitted') {
        console.log('✅ Review submitted, refreshing...');
      }
    });
  }

  downloadInvoicePDF() {
    const invoiceElement = document.getElementById('invoice-content');
    if (!invoiceElement) return;

    html2canvas(invoiceElement, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${this.cartItems[0]?.orderId || 'order'}.pdf`);
    });
  }
}
