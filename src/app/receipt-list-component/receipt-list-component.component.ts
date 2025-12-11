import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../services/FinanceService';

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list-component.component.html',
  styleUrls: ['./receipt-list-component.component.scss']
})
export class ReceiptListComponent implements OnInit {

  receipts: any[] = [];
  paginatedReceipts: any[] = [];

  // Pagination controls
  page = 1;
  pageSize = 7;   // Records per page
  totalPages = 1;

  constructor(private finance: FinanceService) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.finance.getReceipts().subscribe((data: any) => {

      // ⭐ Sort descending by id (latest first)
      this.receipts = (data || []).sort((a: any, b: any) => b.id - a.id);

      this.updatePagination();
    });
  }

  updatePagination() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedReceipts = this.receipts.slice(start, end);
    this.totalPages = Math.ceil(this.receipts.length / this.pageSize);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePagination();
    }
  }

  delete(id: number) {
    if (!confirm('Are you sure to delete this record?')) return;
    this.finance.deleteReceipt(id).subscribe(() => this.load(), err => console.error(err));
  }

}
