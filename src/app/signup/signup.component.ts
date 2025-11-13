import { Component, Inject, Optional, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth/auth-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserStorageService } from '../services/storage/user-storage.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  hidePassword = true;
  isCustomer = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    @Optional() public dialogRef?: MatDialogRef<SignupComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) { }

  ngOnInit(): void {
    this.buildForm();

    // ✅ If opened from parent admin → for adding child admin
    if (this.data?.role === 'CHILD_ADMIN') {
      this.isCustomer = false;
    }
  }

  buildForm(): void {
    this.signupForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    });
  }

  switchRole(isCustomer: boolean): void {
    this.isCustomer = isCustomer;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000 });
      return;
    }

    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      this.snackBar.open('Passwords do not match.', 'Close', { duration: 4000, panelClass: ['error-snackbar'] });
      return;
    }

    const { name, email } = this.signupForm.value;

    // ✅ Dynamically assign correct role
    const signupRequest: any = {
      name,
      email,
      password,
      role: this.data?.role
        ? this.data.role // e.g., CHILD_ADMIN (from parent admin)
        : this.isCustomer
          ? 'CUSTOMER'
          : 'PARENT_ADMIN',
      createdBy: this.data?.createdBy || UserStorageService.getUserId() || null
    };

    console.log('Signup Request:', signupRequest);

    this.authService.register(signupRequest).subscribe({
      next: () => {
        this.snackBar.open('Sign up successful!', 'Close', { duration: 3000 });

        // ✅ Close dialog if opened as modal
        if (this.dialogRef) {
          this.dialogRef.close('success');
        } else {
          // ✅ Navigate if opened via route
          this.router.navigateByUrl('/login');
        }
      },
      error: (err) => {
        const errMsg = err?.error?.message || 'Sign up failed. Please try again.';
        this.snackBar.open(errMsg, 'Close', { duration: 4000, panelClass: ['error-snackbar'] });
      }
    });
  }

  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close('cancel');
    } else {
      this.router.navigateByUrl('/');
    }
  }



}
