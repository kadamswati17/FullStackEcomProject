import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';

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
    private activatedRoute: ActivatedRoute
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
    if (!this.reviewForm.valid) {
      this.snackBar.open('Please fill all required fields', 'close', { duration: 3000 });
      return;
    }

    const formData: FormData = new FormData();
    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    }
    formData.append('productId', this.productId.toString());
    // formData.append('userId', UserStorageService.getUser().toString());
    formData.append('rating', this.reviewForm.get('rating')?.value);
    formData.append('description', this.reviewForm.get('description')?.value);

    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    let userId: any = UserStorageService.getUser();

    if (typeof userId == 'object' && userId.id) {
      userId = userId.id;
    } else {
      userId = UserStorageService.getUserId();
    }

    formData.append('userId', userId.toString());


    this.customerService.giveReview(formData).subscribe(res => {
      if (res?.id != null) {
        this.snackBar.open('Review Posted Successfully', 'close', { duration: 5000 });
        this.router.navigateByUrl('customer/my_orders');
      } else {
        this.snackBar.open('Something went wrong', 'ERROR', { duration: 5000 });
      }
    });
  }
}
