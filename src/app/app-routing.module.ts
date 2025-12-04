import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
// import { TrackOrderComponent } from './track-order/track-order.component';
// import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { OrderDetailsComponent } from './customer/customer/order-details/order-details.component';
import { PaymentFormComponent } from './payment-form-component/payment-form-component.component';
import { PaymentListComponent } from './payment-list-component/payment-list-component.component';
import { ReceiptFormComponent } from './receipt-form-component/receipt-form-component.component';
import { ReceiptListComponent } from './receipt-list-component/receipt-list-component.component';


export const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: '', component: DashboardComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: SignupComponent },
  // { path: "order", component: TrackOrderComponent },
  { path: 'order/:id', component: OrderDetailsComponent },

  { path: 'payment/new', component: PaymentFormComponent },
  { path: 'payment/list', component: PaymentListComponent },
  { path: 'receipt/new', component: ReceiptFormComponent },
  { path: 'receipt/list', component: ReceiptListComponent },
  { path: "receipt/edit/:id", component: ReceiptFormComponent }
  ,
  { path: 'payment/edit/:id', component: PaymentFormComponent }
  ,
  { path: 'customer', loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  // { path: '**', redirectTo: '/login' }
];


// <button mat-button routerLink="/order">Track Order</button>
// <button mat-button routerLink="/register">Register</button>
// <button mat-button routerLink="/login">Login</button>


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
