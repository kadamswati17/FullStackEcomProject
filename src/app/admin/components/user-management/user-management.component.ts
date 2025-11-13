import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth-service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  users: any[] = [];
  loading = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.authService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.loading = false;
      }
    });
  }

  toggleActivation(user: any) {
    this.authService.toggleUserActivation(user.id, user.active).subscribe({
      next: (updatedUser) => {
        user.active = updatedUser.active;
      },
      error: (err) => console.error('Failed to toggle activation', err)
    });
  }

}
