import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
// import { TrackOrderComponent } from './track-order/track-order.component';
import { HomeComponent } from './home/home.component';

// Finance components
import { PaymentFormComponent } from './payment-form-component/payment-form-component.component';
import { PaymentListComponent } from './payment-list-component/payment-list-component.component';
import { ReceiptFormComponent } from './receipt-form-component/receipt-form-component.component';
import { ReceiptListComponent } from './receipt-list-component/receipt-list-component.component';

// Other
import { NgxImageCompressService } from 'ngx-image-compress';
import { AdminModule } from './admin/admin.module';
import { ProductionEntryComponent } from './production-entry/production-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    // TrackOrderComponent,
    HomeComponent,

    // Finance Components
    PaymentFormComponent,
    PaymentListComponent,
    ReceiptFormComponent,
    ReceiptListComponent,
    ProductionEntryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Material
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,

    AppRoutingModule,
    AdminModule
  ],
  providers: [NgxImageCompressService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
