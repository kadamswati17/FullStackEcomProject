import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';  // ✅ Correct

import { AdminService } from '../../service/admin.service';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent {
  productForm: FormGroup;
  categories: any[];  // rename to match template
  selectedFile: File = null;
  imagePreview: string | ArrayBuffer = null;
  existingImage: string | null = null;
  productId: string;

  imgChanged = false;

  constructor(

    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private adminService: AdminService,
    private activatedroute: ActivatedRoute,
    private imageCompress: NgxImageCompressService
  ) { }

  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];

  //   if (file) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = (e: any) => {
  //       const imgBase64 = e.target.result;

  //       // Compress image
  //       this.imageCompress.compressFile(imgBase64, -1, 50, 50).then(
  //         compressedImage => {
  //           this.imagePreview = compressedImage; // for preview
  //           this.selectedFile = this.dataURLtoFile(compressedImage, file.name); // convert back to File
  //           this.imgChanged = true;
  //           this.existingImage = null;
  //         }
  //       );
  //     };
  //   }
  // }



  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (!file) return;

    this.selectedFile = file;

    // 1️⃣ Original file size in KB
    console.log('Original size:', (file.size / 1024).toFixed(2), 'KB');

    // Convert File to Base64 first
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      const imgBase64 = e.target.result;

      // 2️⃣ Compress image using ngx-image-compress
      this.imageCompress.compressFile(imgBase64, -1, 50, 50).then(
        (compressedImage) => {
          this.imagePreview = compressedImage; // for preview

          // Convert compressed Base64 back to File for FormData
          this.selectedFile = this.dataURLtoFile(compressedImage, file.name);

          // 3️⃣ Compressed size in KB
          const compressedSizeInKB = this.imageCompress.byteCount(compressedImage) / 1024;
          console.log('Compressed size:', compressedSizeInKB.toFixed(2), 'KB');

          this.imgChanged = true;
          this.existingImage = null;
        }
      );
    };
  }


  // Helper to convert Base64 back to File
  dataURLtoFile(dataurl: string, filename: string) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }


  previewImage() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(this.selectedFile);

  }
  ngOnInit(): void {
    this.productId = this.activatedroute.snapshot.params['productId'];
    this.productForm = this.fb.group({
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],

    });
    this.getAllCategories();
    this.getProductById();
  }

  getAllCategories() {
    this.adminService.getAllCategory().subscribe(
      (res => {
        this.categories = res;
      })
    );
  }

  getProductById() {
    this.adminService.getProductById(this.productId).subscribe(res => {
      this.productForm.patchValue(res);
      this.existingImage = 'data:image/jpeg;base64,' + res.byteImg;
    })
  }

  clicked() {
    if (this.categories == null || this.categories.length == 0) {
      this.getAllCategories();
    }
  }

  updateProduct(): void {
    if (this.productForm.valid) {
      const formData = new FormData();

      if (this.imgChanged && this.selectedFile) {
        formData.append('img', this.selectedFile);
      }

      formData.append('img', this.selectedFile);
      formData.append('categoryId', this.productForm.get('categoryId').value);
      formData.append('name', this.productForm.get('name').value);
      formData.append('price', this.productForm.get('price').value);
      formData.append('description', this.productForm.get('description').value);

      this.adminService.updateProduct(this.productId, formData).subscribe(
        (res) => {
          if (res.id != null) {
            this.snackbar.open('Product updated successfully', 'Close', {
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

