import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PostProductComponent } from '../post-product/post-product.component';

declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  allProducts: any[] = [];
  groupedProducts: { name: string, products: any[] }[] = [];
  categories: any[] = [];
  searchProductForm!: FormGroup;
  selectedCategory: string | null = null;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.searchProductForm = this.fb.group({
      title: [null, Validators.required],
    });

    this.getAllProducts();
    this.loadCategories();

    this.searchProductForm.get('title')?.valueChanges.subscribe(value => {
      if (!value) this.applyCategoryFilter();
      else this.search(value);
    });
  }

  getAllProducts() {
    this.products = [];
    this.adminService.getAllProducts().subscribe(res => {
      res.forEach(p => p.processedImg = 'data:image/jpeg;base64,' + p.byteImg);
      this.products = [...res];
      this.allProducts = [...res];
      this.applyCategoryFilter(true); // Load first category by default
    });
  }

  loadCategories() {
    this.adminService.getAllCategory().subscribe({
      next: (res) => {
        this.categories = res;
        if (res.length > 0 && !this.selectedCategory) {
          this.selectedCategory = res[0].name;
        }
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  selectCategory(category: any | null) {
    this.selectedCategory = category ? category.name : null;
    this.applyCategoryFilter();

    const offcanvasEl = document.getElementById('adminCategorySidebar');
    if (offcanvasEl) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
      bsOffcanvas?.hide();
    }
  }

  applyCategoryFilter(loadFirst = false) {
    let filtered = [...this.allProducts];
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.categoryName === this.selectedCategory);
    } else if (loadFirst && this.categories.length > 0) {
      filtered = filtered.filter(p => p.categoryName === this.categories[0].name);
      this.selectedCategory = this.categories[0].name;
    }

    const grouped: { [key: string]: any[] } = {};
    filtered.forEach(p => {
      if (!grouped[p.categoryName]) grouped[p.categoryName] = [];
      grouped[p.categoryName].push(p);
    });

    this.groupedProducts = Object.keys(grouped).map(key => ({ name: key, products: grouped[key] }));
  }

  submitForm() {
    const title = this.searchProductForm.get('title')?.value;
    if (!title) return this.applyCategoryFilter();

    this.adminService.getAllProductsByName(title).subscribe(res => {
      res.forEach(p => p.processedImg = 'data:image/jpeg;base64,' + p.byteImg);
      this.allProducts = [...res];
      this.applyCategoryFilter();
    });
  }

  search(value: string) {
    if (!value) return this.applyCategoryFilter();
    const filtered = this.allProducts.filter(p => p.name.toLowerCase().includes(value.toLowerCase()));
    this.allProducts = [...filtered];
    this.applyCategoryFilter();
  }

  deleteProduct(productId: any) {
    if (!productId) {
      this.snackbar.open('Product ID missing', 'Close', { duration: 3000 });
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

  openAddProductModal(): void {
    const dialogRef = this.dialog.open(PostProductComponent, {
      width: '550px',
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(() => this.getAllProducts());
  }
}
