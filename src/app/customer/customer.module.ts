import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Routing
import { CustomerRoutingModule } from './customer-routing.module';

// Components
import { CustomerComponent } from './customer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CartComponent } from './components/cart/cart.component';
import { ViewOrderedProductsComponent } from './components/view-ordered-products/view-ordered-products.component';
import { ReviewOrderedProductComponent } from './components/review-ordered-product/review-ordered-product.component';
import { MyOrderComponent } from './components/my-order/my-order.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';

// Angular Material Modules
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { AngularMaterialDemo } from '../AngularMaterialDemo';
import { ViewProductDetailComponent } from './components/view-product-detail/view-product-detail.component';
import { ViewWishlistComponent } from './components/view-wishlist/view-wishlist.component';
import { OrderDetailsComponent } from './customer/order-details/order-details.component';

@NgModule({
  declarations: [
    CustomerComponent,
    DashboardComponent,
    CartComponent,
    ViewOrderedProductsComponent,
    ReviewOrderedProductComponent,
    MyOrderComponent,
    PlaceOrderComponent,
    ViewProductDetailComponent,
    ViewWishlistComponent,
    OrderDetailsComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularMaterialDemo,
    MatIconModule,
    MatFormFieldModule, // ✅ Added
    MatInputModule,     // ✅ Added
    MatButtonModule,
    MatDialogModule,    // ✅ Added for MatDialog
    MatSnackBarModule,  // ✅ Added for snackbar
    MatTableModule
  ],
})
export class CustomerModule { }
