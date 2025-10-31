import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from './signup/signup.component';
import { UserStorageService } from './services/storage/user-storage.service';
import { Router } from '@angular/router';
import { AdminService } from './admin/service/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'ECommerceApp';
  isCustomerLoggedIn: boolean = UserStorageService.isCustomerLoggedIn();
  isAdminLoggedIn: boolean = UserStorageService.isAdminLoggedIn();
  userRole: string | null = UserStorageService.getUserRole(); // ✅ new property
  categories: any[] = [];

  constructor(
    private router: Router,
    private adminService: AdminService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
      this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();
      this.userRole = UserStorageService.getUserRole(); // ✅ update dynamically
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.adminService.getAllCategory().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }


  logOut(): void {
    UserStorageService.signOut();
    this.router.navigateByUrl('login');
  }

  showWishlistAlert(event: Event): void {
    alert('Please Login or Register to see your Wishlist');
  }

  // ✅ Enhanced Add User / Child Admin Modal
  openAddUserModal(): void {
    const role = this.userRole === 'PARENT_ADMIN' ? 'CHILD_ADMIN' : null;

    const dialogRef = this.dialog.open(SignupComponent, {
      width: '550px',
      height: '600px',
      disableClose: true,
      data: {
        createdBy: UserStorageService.getUserId(), // who created
        title: role ? 'Add Child Admin' : 'Sign Up',
        role: role // pass CHILD_ADMIN if parent admin
      }

    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        console.log('User added successfully');
      }
    });
  }
}
