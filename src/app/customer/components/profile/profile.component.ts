import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth/auth-service';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userId!: number;
  loading = false;
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Track editable fields
  editableFields: any = {
    name: false,
    email: false,
    password: false
  };

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = UserStorageService.getUser();
    if (!user) return;

    this.userId = user.userId;

    this.profileForm = this.fb.group({
      name: [user.name || '', Validators.required],
      email: [user.email || '', [Validators.required, Validators.email]],
      password: [''],
      role: [{ value: user.role, disabled: true }]
    });

    // Fetch latest info from backend
    this.authService.getUserInfo(this.userId).subscribe({
      next: (res) => this.profileForm.patchValue(res),
      error: () => this.snackBar.open('Failed to load user info', 'Close', { duration: 3000 })
    });
  }

  // Toggle edit mode for a field
  toggleEdit(field: string) {
    if (this.editableFields[field]) {
      // If check icon clicked, stop editing
      this.editableFields[field] = false;
    } else {
      this.editableFields[field] = true;
      // Optionally focus the input
      setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>(`input[formcontrolname=${field}]`);
        input?.focus();
      });
    }
  }

  // Update only changed fields
  updateProfile(): void {
    const payload: any = { id: this.userId };

    Object.keys(this.editableFields).forEach(field => {
      if (this.editableFields[field] && this.profileForm.get(field)?.value) {
        payload[field] = this.profileForm.get(field)?.value;
      }
    });

    if (Object.keys(payload).length === 1) {
      this.snackBar.open('No changes detected', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    this.authService.updateUser(payload).subscribe({
      next: () => {
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
        this.loading = false;
        // Reset editable flags
        Object.keys(this.editableFields).forEach(f => this.editableFields[f] = false);
      },
      error: () => {
        this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
