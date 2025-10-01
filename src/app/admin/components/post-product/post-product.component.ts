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

  clicked() {
    if (this.categories == null || this.categories.length == 0) {
      this.getAllCategories();
    }
  }

  addProduct(): void {
    console.log("Form values:", this.productForm.value);

    if (this.productForm.valid) {
      const formData = new FormData();

      if (this.selectedFile) {
        formData.append('img', this.selectedFile, this.selectedFile.name);
      } else {
        console.warn("No file selected");
      }

      formData.append('categoryId', this.productForm.get('categoryId')?.value);
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('description', this.productForm.get('description')?.value);

      console.log("FormData contents:");
      formData.forEach((value, key) => {
        console.log(key, value); // This will correctly print all appended values
      });

      this.adminService.addProduct(formData).subscribe({
        next: (res) => {
          console.log("res", res);
          this.snackbar.open('Product added successfully', 'Close', { duration: 5000 });
          this.router.navigateByUrl('/admin/dashboard');
        },
        error: (err) => {
          console.error("Error adding product:", err);
        }
      });
    } else {
      console.warn("Form is invalid");
      Object.keys(this.productForm.controls).forEach(field => {
        const control = this.productForm.get(field);
        control?.markAsDirty();
        control?.updateValueAndValidity();
      });
    }
  }


}
