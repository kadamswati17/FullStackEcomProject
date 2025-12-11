import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.scss']
})
export class PostProductComponent {
  productForm: FormGroup;
  categories: any[] = [];
  selectedFile: File = null;
  imagePreview: string | ArrayBuffer = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private adminService: AdminService,
    public dialogRef: MatDialogRef<PostProductComponent>
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  // ---------- FILE SELECT ----------
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Compress before using image
    this.compressImage(file, 800, 0.7).then((compressedFile) => {
      this.selectedFile = compressedFile;
      this.previewImage();
    });
  }

  // ---------- IMAGE SIZE REDUCTION (REUSE THIS ANYWHERE) ----------
  compressImage(file: File, maxSize = 800, quality = 0.6): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio and resize
          if (width > height) {
            if (width > maxSize) {
              height = height * (maxSize / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = width * (maxSize / height);
              height = maxSize;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject("Compression failed");

              resolve(
                new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, '') + '_compressed.jpg',
                  {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  }
                )
              );
            },
            'image/jpeg',
            quality
          );
        };

        img.onerror = () => reject("Image load error");
      };
    });
  }

  // ---------- PREVIEW IMAGE ----------
  previewImage() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  // ---------- INIT FORM ----------
  ngOnInit(): void {
    this.productForm = this.fb.group({
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });

    this.getAllCategories();
  }

  // ---------- LOAD CATEGORIES ----------
  getAllCategories() {
    this.adminService.getAllCategory().subscribe(res => {
      this.categories = res;
    });
  }

  clicked() {
    if (!this.categories?.length) {
      this.getAllCategories();
    }
  }

  // ---------- SUBMIT PRODUCT ----------
  addProduct(): void {
    if (this.productForm.valid) {
      const formData = new FormData();

      if (this.selectedFile) {
        formData.append('img', this.selectedFile, this.selectedFile.name);
      }

      formData.append('categoryId', this.productForm.get('categoryId')?.value);
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('description', this.productForm.get('description')?.value);

      const userId = UserStorageService.getUserId();
      if (userId) formData.append('userId', userId.toString());

      this.adminService.addProduct(formData).subscribe({
        next: () => {
          this.snackbar.open('Product added successfully', 'Close', { duration: 5000 });
          this.dialogRef.close();
        },
        error: err => console.error(err)
      });
    } else {
      Object.keys(this.productForm.controls).forEach(field => {
        const control = this.productForm.get(field);
        control?.markAsDirty();
        control?.updateValueAndValidity();
      });
    }
  }
}
