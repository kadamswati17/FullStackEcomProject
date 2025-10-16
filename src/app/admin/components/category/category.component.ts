import { Component, Inject, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../../service/admin.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { PostCategoryComponent } from '../post-category/post-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  categories: any[] = [];
  isAdmin: boolean = UserStorageService.getUserRole() === 'ADMIN';
  showAddButton: boolean = true; // default true

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    @Optional() private dialogRef?: MatDialogRef<CategoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) { }

  ngOnInit(): void {
    this.getCategories();

    if (this.data && this.data.showAddButton === false) {
      this.showAddButton = false;
    }
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

  closeDialog(selectedCategory?: any) {
    if (this.dialogRef) {
      this.dialogRef.close(selectedCategory);
    }
  }
}
