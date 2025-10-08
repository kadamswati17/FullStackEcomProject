import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-review-ordered-product',
  templateUrl: './review-ordered-product.component.html',
  styleUrls: ['./review-ordered-product.component.scss']
})
export class ReviewOrderedProductComponent implements OnInit {

  productId!: number;
  reviewForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private customerService: CustomerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogRef: MatDialogRef<ReviewOrderedProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: number }
  ) { }

  ngOnInit(): void {
    // ✅ now productId is initialized after constructor
    this.productId = this.activatedRoute.snapshot.params['productId'];

    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required]],
      description: [null, [Validators.required]]   // fixed typo
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.previewImage();
    }
  }

  previewImage(): void {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  submitForm(): void {
    console.log("📌 submitForm called");

    if (!this.reviewForm.valid) {
      console.log("❌ Form invalid");
      this.snackBar.open('Please fill all required fields', 'close', { duration: 3000 });
      return;
    }

    const formData: FormData = new FormData();

    console.log("🔹 productId:", this.productId);
    console.log("🔹 userId:", UserStorageService.getUser()?.id || UserStorageService.getUserId());
    console.log("🔹 rating:", this.reviewForm.get('rating')?.value);
    console.log("🔹 description:", this.reviewForm.get('description')?.value);

    formData.append('productId', this.productId.toString());
    formData.append('userId', (UserStorageService.getUser()?.id || UserStorageService.getUserId()).toString());
    formData.append('rating', this.reviewForm.get('rating')?.value);
    formData.append('description', this.reviewForm.get('description')?.value);

    if (this.selectedFile) {
      console.log("🔹 Image selected:", this.selectedFile.name, this.selectedFile.size);
      formData.append('img', this.selectedFile);
    } else {
      console.log("⚠️ No image selected");
    }

    this.customerService.giveReview(formData).subscribe(res => {
      console.log("📌 Review API response:", res);
      if (res?.id != null) {
        console.log("✅ Review posted successfully");
        this.snackBar.open('Review Posted Successfully', 'close', { duration: 5000 });
        this.router.navigateByUrl('customer/my_orders');
      } else {
        console.log("❌ Error posting review");
        this.snackBar.open('Something went wrong', 'ERROR', { duration: 5000 });
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
