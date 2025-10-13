import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CartComponent } from './components/cart/cart.component';
import { MyOrderComponent } from './components/my-order/my-order.component';
import { ViewOrderedProductsComponent } from './components/view-ordered-products/view-ordered-products.component';
import { ReviewOrderedProductComponent } from './components/review-ordered-product/review-ordered-product.component';
import { ViewProductDetailComponent } from './components/view-product-detail/view-product-detail.component';
import { ViewWishlistComponent } from './components/view-wishlist/view-wishlist.component';

const routes: Routes = [
  { path: '', component: CustomerComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: MyOrderComponent },
  { path: 'ordered_products/:orderId', component: ViewOrderedProductsComponent },
  { path: 'review/:productId', component: ReviewOrderedProductComponent },
  { path: 'product/:productId', component: ViewProductDetailComponent },
  { path: 'wishlist', component: ViewWishlistComponent },

  // [routerLink]="['/customer/ordered_products', myOrder.id]">
  //   ReviewOrderedProductComponent





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
