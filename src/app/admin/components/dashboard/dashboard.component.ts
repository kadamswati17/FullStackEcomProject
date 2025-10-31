import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PostProductComponent } from '../post-product/post-product.component';

declare var bootstrap: any; // For controlling offcanvas programmatically

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  searchProductForm!: FormGroup;
  categories: any[] = [];

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
    this.loadCategories();

    this.searchProductForm = this.fb.group({
      title: [null, Validators.required],
      category: [null]
    });

    // Live search
    this.searchProductForm.get('title')?.valueChanges.subscribe(value => {
      if (!value) this.getAllProducts();
      else this.search(value);
    });
  }

  getAllProducts() {
    this.products = [];
    this.adminService.getAllProducts().subscribe(res => {
      res.forEach(p => {
        p.processedImg = 'data:image/jpeg;base64,' + p.byteImg;
        this.products.push(p);
      });
    });
  }

  submitForm() {
    const title = this.searchProductForm.get('title')?.value;
    if (!title) return this.getAllProducts();

    this.adminService.getAllProductsByName(title).subscribe(res => {
      this.products = res.map(p => ({
        ...p,
        processedImg: 'data:image/jpeg;base64,' + p.byteImg
      }));
    });
  }

  deleteProduct(productId: any) {
    if (!productId) {
      this.snackbar.open('Product ID is missing!', 'Close', { duration: 3000 });
      return;
    }

    this.adminService.deleteProduct(productId).subscribe({
      next: (res: any) => {
        this.snackbar.open(res.message, 'Close', { duration: 3000 });
        this.getAllProducts();
      },
      error: (err) => {
        console.error(err);
        this.snackbar.open('Failed to delete product', 'Close', { duration: 3000 });
      }
    });
  }

  search(value: string) {
    if (!value) return this.getAllProducts();
    const filtered = this.products.filter(p => p.name.toLowerCase().includes(value.toLowerCase()));
    this.products = filtered;
  }

  openAddProductModal(): void {
    const dialogRef = this.dialog.open(PostProductComponent, {
      width: '550px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(() => this.getAllProducts());
  }

  loadCategories() {
    this.adminService.getAllCategory().subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  selectCategory(category: any) {
    this.searchProductForm.patchValue({ category: category.name });

    // Close sidebar
    const offcanvasEl = document.getElementById('adminCategorySidebar');
    if (offcanvasEl) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
      bsOffcanvas?.hide();
    }
  }
}
