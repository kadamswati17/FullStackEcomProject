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
  categories: any[];
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

  // onFileSelected(event: any) {
  //   this.selectedFile = event.target.files[0];
  //   this.previewImage();
  // }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Compress the image before using it
    this.compressImage(file, 700, 700, 0.2).then((compressedFile) => {
      this.selectedFile = compressedFile;
      this.previewImage();
    });
  }

  /**
   * Compress image to target dimensions and quality
   * @param file - Original File
   * @param maxWidth - Max width
   * @param maxHeight - Max height
   * @param quality - Compression quality (0.1 to 1.0)
   */
  compressImage(file: File, maxWidth: number, maxHeight: number, quality: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          let { width, height } = img;

          // Maintain aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round(height * (maxWidth / width));
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round(width * (maxHeight / height));
              height = maxHeight;
            }
          }

          // Draw image on canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert canvas to Blob (JPEG format)
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('Image compression failed'));
              const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '_compressed.jpg', {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(newFile);
            },
            'image/jpeg',
            quality // adjust between 0.6 - 0.8 for best trade-off
          );
        };

        img.onerror = (err) => reject(err);
      };
    });
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
    this.adminService.getAllCategory().subscribe(res => {
      this.categories = res;
    });
  }

  clicked() {
    if (!this.categories?.length) {
      this.getAllCategories();
    }
  }

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
      if (userId) {
        formData.append('userId', userId.toString());
      } else {
        console.warn('⚠️ No logged-in user found in storage!');
      }

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
