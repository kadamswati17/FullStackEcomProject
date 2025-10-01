import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Component({
  selector: 'app-view-product-detail',
  templateUrl: './view-product-detail.component.html',
  styleUrls: ['./view-product-detail.component.scss']
})
export class ViewProductDetailComponent implements OnInit {

  productId!: number;
  product: any;
  FAQS: any[] = [];
  reviews: any[] = [];

  constructor(
    private activatedroute: ActivatedRoute,
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // ✅ Now initialize productId here after activatedRoute is ready
    this.productId = this.activatedroute.snapshot.params["productId"];
    this.getProductDetailById();
  }

  getProductDetailById() {
    // ✅ Correct method name
    this.customerService.getProductDetails(this.productId).subscribe(res => {
      this.product = res.productDtoList;
      this.product.processedImg = 'data:image/png;base64,' + res.productDtoList.byteImg;

      this.FAQS = res.faqDtoList;

      res.reviewDtoList.forEach(element => {
        element.processedImg = 'data:image/png;base64,' + element.returnedImg;
        this.reviews.push(element);
      });
    });
  }

  addToWishlist() {
    const wishListDto = {
      productId: this.productId,
      userId: UserStorageService.getUser()
    }

    this.customerService.addProductToWishlist(wishListDto).subscribe(res => {
      if (res.id != null) {
        this.snackBar.open('product Added to Wishlist Successfully', 'close', {
          duration: 5000
        });
      } else {
        this.snackBar.open("Already in Wishlist", 'ERROR', {
          duration: 5000
        })
      }
    })
  }
}
