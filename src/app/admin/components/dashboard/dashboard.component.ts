import { Component } from '@angular/core';
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
export class DashboardComponent {
  products: any[] = [];
  searchProductForm!: FormGroup;
  categories: any[] = []; // store categories for sidebar

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

    // Search by title live
    this.searchProductForm.get('title')?.valueChanges.subscribe(value => {
      if (!value) this.getAllProducts();
      else this.search(value);
    });
  }

  getAllProducts() {
    this.products = [];
    this.adminService.getAllProducts().subscribe(res => {
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
    });
  }

  submitForm() {
    const title = this.searchProductForm.get('title')?.value;
    this.products = [];
    this.adminService.getAllProductsByName(title).subscribe(res => {
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
    });
  }

  deleteProduct(productId: any) {
    this.adminService.deleteProduct(productId).subscribe(res => {
      this.snackbar.open(res.message, 'Close', { duration: 3000 });
      this.getAllProducts();
    });
  }

  search(value: string) {
    if (!value) return this.getAllProducts();
    const filtered = this.products.filter(p =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );
    this.products = filtered;
  }

  openAddProductModal(): void {
    const dialogRef = this.dialog.open(PostProductComponent, {
      width: '550px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(() => this.getAllProducts());
  }

  // ✅ Load categories for sidebar
  loadCategories() {
    this.adminService.getAllCategory().subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  // ✅ When user selects a category
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
