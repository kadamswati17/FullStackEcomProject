import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinanceService } from '../services/FinanceService';
import { UserStorageService } from '../services/storage/user-storage.service';

@Component({
  selector: 'app-receipt-form',
  templateUrl: './receipt-form-component.component.html',
  styleUrls: ['./receipt-form-component.component.scss']
})
export class ReceiptFormComponent implements OnInit {

  form!: FormGroup;
  previewImage: string | null = null;
  receiptImageBase64: string | null = null;

  receiptId: number | null = null;
  isEdit = false;

  users: any[] = [];
  loggedInUser: any; // ⭐ Needed for parentId

  constructor(
    private fb: FormBuilder,
    private finance: FinanceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      customerId: [''],
      parentId: [''],

      amount: ['', [Validators.required, Validators.min(1)]],
      receiptDate: [today, Validators.required],
      receiptImage: [''],

      transactionType: [null, Validators.required],

      partyName: ['', Validators.required],

      paymentMode: ['', Validators.required],
      transactionId: [''],
      description: [''],

      createdBy: [Number(UserStorageService.getUserId())]
    });

    this.loadUsersAndThenReceipt();
  }

  // Load users + store logged-in details before filtering
  loadUsersAndThenReceipt() {
    this.finance.getUsers().subscribe((data: any[]) => {

      const loggedInId = Number(UserStorageService.getUserId());
      const loggedInRole = UserStorageService.getUserRole();

      const mappedUsers = data.map(u => ({
        id: u.id,
        name: u.name,
        userRole: u.userRole || u.role,
        createdBy: u.createdBy,   // ⭐ now backend sends correct parent ID
      }));

      // ⭐ Store logged-in user BEFORE filtering
      this.loggedInUser = mappedUsers.find(u => u.id === loggedInId);

      // Apply role-based filtering
      this.users = mappedUsers.filter(u => {

        // Never show logged-in user
        if (u.id === loggedInId) return false;

        // CASE 1: PARENT_ADMIN
        if (loggedInRole === 'PARENT_ADMIN') {
          if (u.userRole === 'CHILD_ADMIN') return false;
          return ['ADMIN', 'CUSTOMER', 'PARENT_ADMIN'].includes(u.userRole);
        }

        // CASE 2: CHILD_ADMIN
        if (loggedInRole === 'CHILD_ADMIN') {
          if (u.userRole === 'CHILD_ADMIN') return false;

          // ⭐ Hide its own parent
          if (u.id === this.loggedInUser?.createdBy) return false;

          return ['ADMIN', 'CUSTOMER', 'PARENT_ADMIN'].includes(u.userRole);
        }

        // CASE 3: ADMIN
        if (loggedInRole === 'ADMIN') return true;

        // CASE 4: CUSTOMER
        if (loggedInRole === 'CUSTOMER') {
          return ['ADMIN', 'PARENT_ADMIN'].includes(u.userRole);
        }

        return true;
      });

      // Load receipt if editing
      this.receiptId = Number(this.route.snapshot.paramMap.get('id'));
      this.isEdit = !!this.receiptId;
      if (this.isEdit) this.loadReceipt();

      // Auto-fill logic
      this.form.get('partyName')!.valueChanges.subscribe((selectedUser: any) => {
        if (selectedUser) this.applyPartySelection(selectedUser);
      });

    });
  }

  // ⭐ FINAL WORKING createdBy + parentId logic
  applyPartySelection(selectedUser: any) {
    const loggedInId = Number(UserStorageService.getUserId());
    const loggedInRole = UserStorageService.getUserRole();

    let parentId = loggedInId; // Default for PARENT_ADMIN

    if (loggedInRole === 'CHILD_ADMIN') {
      // Use loggedInUser from mappedUsers (not filtered list)
      parentId = this.loggedInUser?.createdBy;
    }

    this.form.patchValue({
      customerId: selectedUser.id,
      createdBy: loggedInId,
      parentId: parentId   // ⭐ NOW CORRECT
    });
  }

  loadReceipt() {
    this.finance.getReceiptById(this.receiptId!).subscribe((data: any) => {

      const matchedUser = this.users.find(
        u => u.id === data.customerId || u.name === data.partyName
      );

      this.form.patchValue({
        customerId: data.customerId,
        parentId: data.parentId,
        amount: data.amount,
        receiptDate: data.receiptDate,
        receiptImage: data.receiptImage,

        transactionType: data.transactionType,
        partyName: matchedUser ?? null,

        paymentMode: data.paymentMode,
        transactionId: data.transactionId,
        description: data.description,

        createdBy: data.createdBy
      });

      if (data.receiptImage) this.previewImage = data.receiptImage;
    });
  }

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
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const resizedBase64 = canvas.toDataURL('image/jpeg', 1.0);

        this.receiptImageBase64 = resizedBase64;
        this.previewImage = resizedBase64;

        this.form.patchValue({ receiptImage: resizedBase64 });
      };
    };
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Please fill all fields correctly.');
      return;
    }

    const formValue = { ...this.form.value };

    if (formValue.partyName && typeof formValue.partyName === 'object') {
      formValue.partyName = formValue.partyName.name;
    }

    if (this.isEdit) {
      this.finance.updateReceipt(this.receiptId!, formValue).subscribe(() => {
        alert('Receipt updated successfully!');
        this.router.navigate(['/receipt/list']);
      });
    } else {
      this.finance.saveReceipt(formValue).subscribe(() => {
        alert('Receipt saved successfully!');
        this.router.navigate(['/receipt/list']);
      });
    }
  }
  getTransactionColor() {
    const type = this.form?.get('transactionType')?.value;

    if (type == 1) {
      return 'receipt-type';
    } else if (type == 0) {
      return 'payment-type';
    }
    return '';
  }

  getFormColor() {
    const type = Number(this.form?.get('transactionType')?.value); // Convert to number

    if (type === 1) {
      return 'full-receipt';   // Light green
    }
    if (type === 0) {
      return 'full-payment';   // Light red
    }

    return ''; // Default white
  }



  closeForm() {
    this.router.navigate(['/receipt/list']);
  }
}
