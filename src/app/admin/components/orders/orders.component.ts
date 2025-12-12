import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  cartItems: any[] = [];

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getPlacedOrders();
  }

  getPlacedOrders() {
    this.adminService.getPlacedOrders().subscribe({
      next: (res) => {
        this.orders = res.sort((a: any, b: any) => b.id - a.id);
        console.log('📦 Sorted Orders:', this.orders);
      },
      error: (err) => console.error('❌ Error fetching orders:', err)
    });
  }

  getOrderDetailsById(orderId: number) {
    this.cartItems = [];
    this.adminService.getOrderDetailsById(orderId).subscribe({
      next: (res) => {
        this.cartItems = res.data;
        console.log('🧾 Admin Order Details:', this.cartItems);
      },
      error: (err) => console.error('❌ Error fetching order details:', err)
    });
  }

  changeOrderStatus(orderId: number, status: string) {
    this.adminService.changeOrderStatus(orderId, status).subscribe({
      next: (res) => {
        if (res.id != null) {
          this.snackBar.open('Order status changed successfully', 'close', { duration: 4000 });
          this.getPlacedOrders();
        } else {
          this.snackBar.open('Something went wrong', 'close', { duration: 4000 });
        }
      },
      error: (err) => console.error('❌ Error changing status:', err)
    });
  }

  downloadInvoicePDF() {
    const element = document.getElementById('invoice-content');
    if (!element) return;

    html2canvas(element, { scale: 2, useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${this.cartItems[0]?.orderId}.pdf`);
    });
  }


}
