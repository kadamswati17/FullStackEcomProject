import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinanceService } from '../services/FinanceService';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form-component.component.html',
  styleUrls: ['./payment-form-component.component.scss']
})
export class PaymentFormComponent implements OnInit {

  form!: FormGroup;
  modes = ['CASH', 'UPI', 'BANK', 'CARD'];

  paymentId: number | null = null;
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
      paymentDate: ['', Validators.required],
      mode: ['', Validators.required],
      note: ['', Validators.required]
    });

    this.paymentId = Number(this.route.snapshot.paramMap.get("id"));
    this.isEdit = !!this.paymentId;

    if (this.isEdit) {
      this.loadPayment();
    }
  }

  loadPayment() {
    this.finance.getPaymentById(this.paymentId!).subscribe((data: any) => {
      this.form.patchValue(data);
    });
  }

  submit() {
    if (this.form.invalid) {
      alert("Please fill all fields correctly.");
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEdit) {
      this.finance.updatePayment(this.paymentId!, this.form.value).subscribe(() => {
        alert("Payment updated!");
        this.router.navigate(['/payment/list']);
      });
    } else {
      this.finance.savePayment(this.form.value).subscribe(() => {
        alert("Payment saved!");
        this.router.navigate(['/payment/list']);
      });
    }
  }

  closeForm() {
    this.router.navigate(['/payment/list']);
  }
}
