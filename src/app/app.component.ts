import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from './signup/signup.component';
import { UserStorageService } from './services/storage/user-storage.service';
import { Router } from '@angular/router';
import { AdminService } from './admin/service/admin.service';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ECommerceApp';
  isCustomerLoggedIn: boolean = UserStorageService.isCustomerLoggedIn();
  isAdminLoggedIn: boolean = UserStorageService.isAdminLoggedIn();
  userRole: string | null = UserStorageService.getUserRole();
  categories: any[] = [];

  @Output() categorySelected: EventEmitter<string | null> = new EventEmitter();

  constructor(
    private router: Router,
    private adminService: AdminService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
      this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();
      this.userRole = UserStorageService.getUserRole();
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.adminService.getAllCategory().subscribe({
      next: (response) => this.categories = response,
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  selectCategory(categoryName: string | null) {
    // Emit category to HomeComponent
    this.categorySelected.emit(categoryName);

    const offcanvasEl = document.getElementById('homeSidebar');
    if (offcanvasEl) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
      bsOffcanvas?.hide();
    }
  }

  logOut(): void {
    UserStorageService.signOut();
    this.router.navigateByUrl('login');
  }

  showWishlistAlert(event: Event): void {
    alert('Please Login or Register to see your Wishlist');
  }

  openAddUserModal(): void {
    const role = this.userRole === 'PARENT_ADMIN' ? 'CHILD_ADMIN' : null;

    const dialogRef = this.dialog.open(SignupComponent, {
      width: '550px',
      height: '600px',
      disableClose: true,
      data: {
        createdBy: UserStorageService.getUserId(),
        title: role ? 'Add Child Admin' : 'Sign Up',
        role: role
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') console.log('User added successfully');
    });
  }
}
