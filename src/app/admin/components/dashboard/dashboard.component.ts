import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PostProductComponent } from '../post-product/post-product.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  products: any[] = [];
  searchProductForm!: FormGroup;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]]
    });
    this.searchProductForm.get('title')?.valueChanges.subscribe(value => {
      if (!value) {
        this.getAllProducts();
      } else {
        this.search(value);
      }
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
    this.products = [];
    const title = this.searchProductForm.get('title')?.value;
    this.adminService.getAllProductsByName(title).subscribe(res => {
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
    });
  }

  deleteProduct(productId: any) {
    this.adminService.deleteProduct(productId).subscribe(res => {
      if (res.body == null) {
        this.snackbar.open(res.message, 'Close', { duration: 3000 });
        this.getAllProducts();
      } else {
        this.snackbar.open(res.message, 'Close', { duration: 3000, panelClass: 'error-snackbar' });
        this.getAllProducts();
      }
    });
  }

  search(value: string) {
    if (!value) {
      this.getAllProducts();
      return;
    }
    const filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    this.products = filteredProducts;
  }

  openAddProductModal(): void {
    const dialogRef = this.dialog.open(PostProductComponent, {
      width: '550px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllProducts(); // refresh products after modal close
    });
  }
}
