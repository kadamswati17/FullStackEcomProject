import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-product-faq',
  templateUrl: './post-product-faq.component.html',
  styleUrls: ['./post-product-faq.component.scss']
})
export class PostProductFaqComponent {

  productId!: number;   // ✅ just declare, don't assign yet
  FAQForm!: FormGroup;

  constructor(
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // ✅ safe to access activatedRoute here
    this.productId = Number(this.activatedRoute.snapshot.params['productId']);

    this.FAQForm = this.fb.group({
      question: [null, [Validators.required]],
      answer: [null, [Validators.required]],
    });
  }

  postFAQ() {
    if (this.FAQForm.invalid) {
      this.snackbar.open('Please fill all fields', 'close', { duration: 3000 });
      return;
    }

    this.adminService.postFAQ(this.productId, this.FAQForm.value).subscribe(res => {
      if (res && res.id != null) {
        this.snackbar.open('FAQ Posted Successfully', 'close', { duration: 5000 });
        this.router.navigateByUrl('/admin/dashboard');
      } else {
        this.snackbar.open('Something went wrong', 'close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }
}
