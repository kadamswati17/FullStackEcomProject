import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../services/FinanceService';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list-component.component.html',
  styleUrls: ['./payment-list-component.component.scss']
})
export class PaymentListComponent implements OnInit {

  payments: any[] = [];

  constructor(private finance: FinanceService) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.finance.getPayments().subscribe((data: any) => this.payments = data);
  }

  delete(id: number) {
    this.finance.deletePayment(id).subscribe(() => this.load());
  }
}
