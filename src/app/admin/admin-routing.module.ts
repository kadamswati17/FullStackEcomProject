import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PostCategoryComponent } from './components/post-category/post-category.component';
import { PostProductComponent } from './components/post-product/post-product.component';
import { PostCouponComponent } from './components/post-coupon/post-coupon.component';
import { CouponsComponent } from './components/coupons/coupons.component';
import { OrdersComponent } from './components/orders/orders.component';
import { PostProductFaqComponent } from './components/post-product-faq/post-product-faq.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
// import { ProfileComponent } from './components/profile/profile.component';
import { CategoryComponent } from './components/category/category.component';

import { UserManagementComponent } from './components/user-management/user-management.component';

// const routes: Routes = [
//     { path: '', redirectTo: 'analytics', pathMatch: 'full' },
//   { path: '', component: AdminComponent },
//   { path: 'dashboard', component: DashboardComponent },
//   // { path: 'category', component: PostCategoryComponent },
//   { path: 'category', component: CategoryComponent },
//   { path: 'products', component: PostProductComponent },
//   { path: 'products/:productId', component: UpdateProductComponent },

//   { path: 'post-coupon', component: PostCouponComponent },
//   { path: 'coupons', component: CouponsComponent },
//   { path: 'orders', component: OrdersComponent },
//   { path: 'faq/:productId', component: PostProductFaqComponent },
//   { path: 'update-product/:productId', component: UpdateProductComponent },
//   { path: 'analytics', component: AnalyticsComponent },

// ];


const routes: Routes = [
  { path: '', redirectTo: 'analytics', pathMatch: 'full' }, // 👈 redirect root /admin to /admin/analytics
  { path: 'dashboard', component: DashboardComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'products', component: PostProductComponent },
  { path: 'products/:productId', component: UpdateProductComponent },
  { path: 'post-coupon', component: PostCouponComponent },
  { path: 'coupons', component: CouponsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'faq/:productId', component: PostProductFaqComponent },
  { path: 'update-product/:productId', component: UpdateProductComponent },
  { path: 'analytics', component: AnalyticsComponent },
  // { path: 'profile', component: ProfileComponent },
  { path: 'user-management', component: UserManagementComponent },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
