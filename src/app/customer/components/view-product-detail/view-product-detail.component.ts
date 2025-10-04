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
  product: any = {};
  FAQS: any[] = [];
  reviews: any[] = [];

  readonly fallbackImage = 'assets/no-image.png'; // fallback image path

  constructor(
    private activatedroute: ActivatedRoute,
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.productId = this.activatedroute.snapshot.params["productId"];
    this.getProductDetailById();
  }

  getProductDetailById() {
    this.customerService.getProductDetailById(this.productId).subscribe(res => {
      console.log("Product detail response:", res);
      this.product = res.productDto;
      this.product.processedImg = 'data:image/png;base64,' + res.productDto.byteImg;

      this.FAQS = res.faqDtoList;

      res.reviewDtoList.forEach(element => {
        element.processedImg = 'data:image/png;base64,' + element.returnedImg;
        this.reviews.push(element);
      })

      //   this.product = res;

      //   // Product image
      //   this.product.processedImg = this.product?.byteImg
      //     ? 'data:image/png;base64,' + this.product.byteImg
      //     : this.fallbackImage;

      //   // FAQs
      //   this.FAQS = res.faqDtoList || [];

      //   // Reviews
      //   if (res.reviewDtoList && res.reviewDtoList.length > 0) {
      //     this.reviews = res.reviewDtoList.map(element => {
      //       element.processedImg = element.returnedImg
      //         ? 'data:image/png;base64,' + element.returnedImg
      //         : this.fallbackImage;
      //       return element;
      //     });
      //   }
      // }, err => {
      //   console.error("Error fetching product details:", err);
    });
  }

  addToWishlist() {
    const wishListDto = {
      productId: this.productId,
      userId: UserStorageService.getUser()?.userId
    };

    this.customerService.addProductToWishlist(wishListDto).subscribe({
      next: (res) => {
        if (res.id != null) {
          this.snackBar.open('Product added to Wishlist successfully', 'Close', { duration: 5000 });
        } else {
          this.snackBar.open("Already in Wishlist", 'Error', { duration: 5000 });
        }
      },
      error: (err) => {
        console.error("Error adding to wishlist:", err);
        this.snackBar.open("Something went wrong", 'Error', { duration: 5000 });
      }
    });
  }
}
