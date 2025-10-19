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
      // email: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],

      password: [null, [Validators.required]],
    });
  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'ok', { duration: 3000 });
      return;
    }

    const userName = this.loginForm.get('email')!.value;
    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;


    this.authService.login(userName, password).subscribe(
      (response) => {
        if (UserStorageService.isAdminLoggedIn()) {
          this.router.navigateByUrl('/admin/analytics');
        }
        else if (UserStorageService.isCustomerLoggedIn()) {
          this.router.navigateByUrl('/customer/dashboard');
        }
        else if (UserStorageService.isparentuserLoggedIn()) {
          this.router.navigateByUrl('/admin/analytics');
        }
      },
      (error) => {
        this.snackBar.open('bad credentials', 'error', { duration: 5000 })
      }
    )
  }
}
