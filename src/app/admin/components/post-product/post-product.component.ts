import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.scss']
})
export class PostProductComponent {

  productForm: FormGroup;
  categories: any[];  // rename to match template
  selectedFile: File = null;
  imagePreview: string | ArrayBuffer = null;

  constructor(

    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private adminService: AdminService
  ) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(this.selectedFile);

  }
  ngOnInit(): void {
    this.productForm = this.fb.group({
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],

    });
    this.getAllCategories();
  }

  getAllCategories() {
    this.adminService.getAllCategory().subscribe(
      (res => {
        this.categories = res;
      })
    );
  }

  addProduct(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('img', this.selectedFile);
      formData.append('categoryId', this.productForm.get('categoryId').value);
      formData.append('name', this.productForm.get('name').value);
      formData.append('price', this.productForm.get('price').value);
      formData.append('description', this.productForm.get('description').value);

      this.adminService.addProduct(formData).subscribe(
        (res) => {
          if (res.id != null) {
            this.snackbar.open('Product added successfully', 'Close', {
              duration: 5000
            });
            this.router.navigateByUrl('/admin/dashboard');
          } else {
            this.snackbar.open(res.message, 'ERROR', {
              duration: 5000
            });

          }
        }
      );
    }
    else {
      for (const i in this.productForm.controls) {
        this.productForm.controls[i].markAsDirty();
        this.productForm.controls[i].updateValueAndValidity();
      }
    }
  }
}
