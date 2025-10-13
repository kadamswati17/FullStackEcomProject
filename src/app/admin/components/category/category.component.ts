import { Component, Inject, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../../service/admin.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { PostCategoryComponent } from '../post-category/post-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',  // ✅ match actual file name
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  categories: any[] = [];
  isAdmin: boolean = UserStorageService.getUserRole() === 'ADMIN';

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    @Optional() private dialogRef?: MatDialogRef<CategoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.adminService.getAllCategory().subscribe({
      next: (res) => (this.categories = res),
      error: (err) => console.error('Error fetching categories:', err)
    });
  }


  openAddCategoryModal() {
    const dialogRef = this.dialog.open(PostCategoryComponent, {
      width: '600px',
      disableClose: true,
      panelClass: 'custom-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.getCategories();
      }
    });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
