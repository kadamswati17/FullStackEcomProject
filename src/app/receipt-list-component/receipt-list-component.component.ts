import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../services/FinanceService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { firstValueFrom } from 'rxjs';
import { UserStorageService } from '../services/storage/user-storage.service';

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list-component.component.html',
  styleUrls: ['./receipt-list-component.component.scss']
})
export class ReceiptListComponent implements OnInit {

  loggedInUser: any = {};
  parentInfo: any = {};

  receipts: any[] = [];
  paginatedReceipts: any[] = [];
  ledger: any[] = [];
  customerInfo: any = {};

  page = 1;
  pageSize = 6;
  totalPages = 1;

  constructor(private finance: FinanceService) { }

  async ngOnInit() {

    this.loggedInUser = UserStorageService.getUser();  // FIXED

    console.log("🔵 LOGGED USER =", this.loggedInUser);

    await this.loadParentInfo();
    this.load();
  }


  async loadParentInfo() {

    const role = this.loggedInUser.role || this.loggedInUser.userRole;
    const createdBy = this.loggedInUser.createdBy;

    console.log("🔵 LOGGED USER =", this.loggedInUser);

    // CASE 1 → IF NOT CHILD ADMIN → always show self as parent
    if (role !== "CHILD_ADMIN") {

      this.parentInfo = {
        name: this.loggedInUser.name,
        image: this.loggedInUser.img
          ? "data:image/jpeg;base64," + this.loggedInUser.img
          : this.loggedInUser.image
            ? "data:image/jpeg;base64," + this.loggedInUser.image
            : null
      };

      console.log("🟢 Parent = SELF (not child admin) =", this.parentInfo);
      return;
    }

    // CASE 2 → CHILD ADMIN → must load real parent admin
    try {
      const parentUser: any = await firstValueFrom(
        this.finance.getUserById(createdBy)
      );

      this.parentInfo = {
        name: parentUser.name,
        image: parentUser.img
          ? "data:image/jpeg;base64," + parentUser.img
          : parentUser.image
            ? "data:image/jpeg;base64," + parentUser.image
            : null,
      };

      console.log("🟢 Loaded Parent ADMIN =", this.parentInfo);

    } catch (e) {
      console.log("❌ Parent fetch failed", e);
    }
  }


  // ============================
  // LOAD RECEIPTS
  // ============================
  load() {
    this.finance.getReceipts().subscribe((data: any) => {
      this.receipts = Array.isArray(data) ? data.sort((a, b) => b.id - a.id) : [];
      this.updatePagination();
    });
  }

  updatePagination() {
    const start = (this.page - 1) * this.pageSize;
    this.paginatedReceipts = this.receipts.slice(start, start + this.pageSize);
    this.totalPages = Math.ceil(this.receipts.length / this.pageSize) || 1;
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePagination();
    }
  }

  delete(id: number) {
    if (!confirm("Are you sure?")) return;
    this.finance.deleteReceipt(id).subscribe(() => this.load());
  }

  normalizeImageForView(img: any): string | null {
    if (!img) return null;
    return img.startsWith("data:") ? img : "data:image/jpeg;base64," + img;
  }

  // ============================
  // OPEN LEDGER
  // ============================
  openCustomerReceipts(customerId: number) {
    this.loadLedger(customerId, false);
  }

  downloadLedgerPDF(customerId: number) {
    this.loadLedger(customerId, true);
  }

  async loadLedger(customerId: number, autoDownload = false) {

    console.log("🔴 Ledger loading for =", customerId);
    console.log("🔴 parentInfo =", this.parentInfo);

    const rows = await firstValueFrom(this.finance.getCustomerLedger(customerId)) as any[];
    this.ledger = Array.isArray(rows) ? rows : [];

    const first = this.ledger[0] || {};

    this.customerInfo = {
      id: first.customerId,
      name: first.customerName,
      email: first.customerEmail,
      mobile: first.customerMobile,
      image: first.customerImage
        ? "data:image/jpeg;base64," + first.customerImage
        : null,

      // ⭐ ALWAYS USE COMPUTED parentInfo
      parentName: this.parentInfo.name,
      parentImage: this.parentInfo.image
    };

    console.log("🟣 FINAL customerInfo =", this.customerInfo);

    if (autoDownload) {
      setTimeout(() => this.generatePDF(), 400);
    }
  }


  // ============================
  // ================================
  // PDF GENERATION (WITH PADDING)
  // ================================
  generatePDF() {
    const elem = document.getElementById("ledger-content");
    if (!elem) return;

    const clone = elem.cloneNode(true) as HTMLElement;
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    document.body.appendChild(clone);

    html2canvas(clone, { scale: 3 }).then(canvas => {
      const pdf = new jsPDF('p', 'mm', 'a4');

      // PDF page size
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // ⭐ Padding values
      const paddingLeft = 10;
      const paddingTop = 10;
      const paddingRight = 10;

      // ⭐ New width after padding
      const imgWidth = pageWidth - paddingLeft - paddingRight;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const img = canvas.toDataURL('image/png');

      // ⭐ Add image with padding
      pdf.addImage(img, 'PNG', paddingLeft, paddingTop, imgWidth, imgHeight);

      pdf.save(`ledger_${this.customerInfo.id}.pdf`);
    })
      .finally(() => document.body.removeChild(clone));
  }


}
