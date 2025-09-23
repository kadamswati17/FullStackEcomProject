import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  products: any[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }
  getAllProducts() {
    // Call service to fetch products
    this.products = [];
    this.adminService.getAllProducts().subscribe(res => {
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
    })


  }
}
