import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../services/FinanceService';

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list-component.component.html',
  styleUrls: ['./receipt-list-component.component.scss']
})
export class ReceiptListComponent implements OnInit {

  receipts: any[] = [];

  constructor(private finance: FinanceService) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.finance.getReceipts().subscribe((data: any) => this.receipts = data);
  }

  delete(id: number) {
    this.finance.deleteReceipt(id).subscribe(() => this.load());
  }
}
