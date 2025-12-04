import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinanceService } from '../services/FinanceService';

@Component({
  selector: 'app-receipt-form',
  templateUrl: './receipt-form-component.component.html',
  styleUrls: ['./receipt-form-component.component.scss']
})
export class ReceiptFormComponent implements OnInit {

  form!: FormGroup;
  previewImage: string | null = null;
  receiptImageBase64: string | null = null;

  receiptId: number | null = null;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private finance: FinanceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      customerId: ['', Validators.required],
      parentId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      receiptDate: ['', Validators.required],
      remarks: ['', Validators.required],
      receiptImage: ['', Validators.required]
    });

    this.receiptId = Number(this.route.snapshot.paramMap.get("id"));
    this.isEdit = !!this.receiptId;

    if (this.isEdit) {
      this.loadReceipt();
    }
  }

  loadReceipt() {
    this.finance.getReceiptById(this.receiptId!).subscribe((data: any) => {
      this.form.patchValue(data);

      if (data.receiptImage) {
        this.previewImage = data.receiptImage;
        this.form.patchValue({ receiptImage: data.receiptImage });
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.receiptImageBase64 = reader.result as string;
      this.previewImage = this.receiptImageBase64;

      this.form.patchValue({
        receiptImage: this.receiptImageBase64
      });
    };
    reader.readAsDataURL(file);
  }

  submit() {
    if (this.form.invalid) {
      alert("Please fill all fields correctly.");
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEdit) {
      this.finance.updateReceipt(this.receiptId!, this.form.value).subscribe(() => {
        alert("Receipt updated successfully!");
        this.router.navigate(['/receipt/list']);
      });
    } else {
      this.finance.saveReceipt(this.form.value).subscribe(() => {
        alert("Receipt saved successfully!");
        this.router.navigate(['/receipt/list']);
      });
    }
  }

  closeForm() {
    this.router.navigate(['/receipt/list']);
  }

}
