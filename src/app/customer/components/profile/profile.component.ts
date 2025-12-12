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

  // Profile image
  previewImage: string | null = null;
  selectedImageFile: File | null = null;

  // Track fields to edit
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

    // Load initial stored image OR default
    this.previewImage = user.image ? 'data:image/jpeg;base64,' + user.image : null;

    this.profileForm = this.fb.group({
      name: [user.name || '', Validators.required],
      email: [user.email || '', [Validators.required, Validators.email]],
      password: [''],
      role: [{ value: user.role, disabled: true }]
    });

    // Fetch from backend (latest details)
    this.authService.getUserInfo(this.userId).subscribe({
      next: (res) => {
        this.profileForm.patchValue(res);
        if (res.image) {
          this.previewImage = 'data:image/jpeg;base64,' + res.image;
        }
      },
      error: () =>
        this.snackBar.open('Failed to load user info', 'Close', { duration: 3000 })
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleEdit(field: string) {
    this.editableFields[field] = !this.editableFields[field];

    if (this.editableFields[field]) {
      setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>(
          `input[formcontrolname=${field}]`
        );
        input?.focus();
      });
    }
  }



  // =========== IMAGE SELECT WITH COMPRESSION =============
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600; // 🔥 compress width (reduce as needed)
        const scaleSize = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 🔥 COMPRESS to JPEG (quality 0.7 recommended)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

        // For preview
        this.previewImage = compressedBase64;

        // Convert Base64 → File (Multipart upload requires file)
        this.selectedImageFile = this.base64ToFile(compressedBase64, file.name);
      };
    };
  }

  // Utility: Convert base64 to File object
  base64ToFile(base64: string, filename: string) {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  // =========== UPDATE PROFILE =============
  updateProfile(): void {
    const formData = new FormData();
    formData.append('id', this.userId.toString());

    // Append updated fields only
    if (this.editableFields.name)
      formData.append('name', this.profileForm.get('name')?.value);

    if (this.editableFields.email)
      formData.append('email', this.profileForm.get('email')?.value);

    if (this.editableFields.password && this.profileForm.get('password')?.value)
      formData.append('password', this.profileForm.get('password')?.value);

    // Append image if uploaded
    if (this.selectedImageFile)
      formData.append('image', this.selectedImageFile);

    // If no updates
    if (formData.keys().next().done) {
      this.snackBar.open('No changes detected', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;

    this.authService.updateUser(formData).subscribe({
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
