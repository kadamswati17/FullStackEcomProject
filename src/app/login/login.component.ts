import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';
import { UserStorageService } from '../services/storage/user-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'OK', { duration: 3000 });
      return;
    }

    const username = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        // ✅ Redirect based on role
        if (UserStorageService.isAdminLoggedIn()) {
          this.router.navigateByUrl('/admin/analytics');
        } else if (UserStorageService.isCustomerLoggedIn()) {
          this.router.navigateByUrl('/customer/dashboard');
        } else if (UserStorageService.isparentuserLoggedIn()) {
          this.router.navigateByUrl('/admin/analytics');
        } else if (UserStorageService.isChildUserLoggedIn()) {
          this.router.navigateByUrl('/admin/analytics');
        }
      },
      error: (error) => {
        console.error('Login error:', error);

        if (error.status === 401) {
          this.snackBar.open('Invalid username or password', 'Close', { duration: 4000 });
        } else if (error.status === 403) {
          this.snackBar.open('Your account is deactivated. Please contact admin.', 'Close', { duration: 4000 });
        } else if (error.status === 404) {
          this.snackBar.open('User not found', 'Close', { duration: 4000 });
        } else {
          this.snackBar.open('Something went wrong. Please try again later.', 'Close', { duration: 4000 });
        }
      }
    });
  }
}
