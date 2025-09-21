import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
	signupForm!: FormGroup;
	hidePassword = true;

	constructor(
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		private authService: AuthService,
		private router: Router
	) { }

	ngOnInit(): void {
		this.signupForm = this.fb.group({
			name: [null, [Validators.required]],
			email: [null, [Validators.required, Validators.email]],
			password: [null, [Validators.required]],
			confirmPassword: [null, [Validators.required]],
		});
	}

	togglePasswordVisibility() {
		this.hidePassword = !this.hidePassword;
	}

	onSubmit(): void {
		const password = this.signupForm.get('password')?.value;
		const confirmPassword = this.signupForm.get('confirmPassword')?.value;

		if (password !== confirmPassword) {
			this.snackBar.open('Passwords do not match.', 'Close', {
				duration: 5000,
				panelClass: ['error-snackbar']
			});
			return;
		}

		// Only send required fields to backend
		const { name, email } = this.signupForm.value;
		const signupRequest = { name, email, password };

		console.log('Sending signup request:', signupRequest);

		this.authService.register(signupRequest).subscribe(
			(response) => {
				this.snackBar.open('Sign up successful!', 'Close', { duration: 5000 });
				this.router.navigateByUrl('/login');
			},
			(error) => {
				// Show backend error message if available
				const errMsg = error?.error?.message || 'Sign up failed. Please try again.';
				this.snackBar.open(errMsg, 'Close', {
					duration: 5000,
					panelClass: ['error-snackbar']
				});
			}
		);
	}
}
