import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TrackOrderComponent } from './track-order/track-order.component';

// ✅ Export the routes so main.ts can use them
// ✅ Export the routes
// export const routes: Routes = [
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
//   { path: "login", component: LoginComponent },
//   { path: "register", component: SignupComponent },
//   { path: 'customer', loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule) },
//   { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
//   { path: '**', redirectTo: '/login' }
// ];

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: "login", component: LoginComponent },
  { path: "register", component: SignupComponent },
  { path: "order", component: TrackOrderComponent },

  { path: 'customer', loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: '**', redirectTo: '/login' }
];


// <button mat-button routerLink="/order">Track Order</button>
// <button mat-button routerLink="/register">Register</button>
// <button mat-button routerLink="/login">Login</button>


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
