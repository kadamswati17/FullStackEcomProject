import { Component, OnInit } from '@angular/core';
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
  categories: any[] = [];

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
      this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();
    });

    // Load categories when component initializes
    this.loadCategories();
  }

  loadCategories(): void {
    console.log('Calling getAllCategory API...');
    this.adminService.getAllCategory().subscribe({
      next: (response) => {
        console.log('Categories fetched:', response); // check response here
        this.categories = response;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }


  logOut(): void {
    UserStorageService.signOut();
    this.router.navigateByUrl('login');
  }

  showWishlistAlert(event: Event): void {
    alert('Please Login or Register to see your Wishlist');
  }
}