

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ToasterService } from '../../shared/components/toaster/toaster.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { GlobalService } from '../../core/services/global.service';


@Component({
 selector: 'app-flash-sale',
  imports: [CommonModule,RouterLink ],
  templateUrl: './flash-sale.component.html',
  styleUrl: './flash-sale.component.css' ,
})
export class FlashSaleComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient); 
  private baseUrl = 'http://shopbag.runasp.net/api/';
  
    constructor(
      private cartService: CartService,
      private toaster: ToasterService,
      private globalService: GlobalService
    ) {}
  products: any[] = [];
  private subscription?: Subscription;

  // Timer Logic
  private targetDate = new Date().getTime() + (24 * 60 * 60 * 1000);
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  timerInterval: any;

  ngOnInit() {
    this.getFlashSaleProducts();
    this.startTimer();
  }
 // products 
getFlashSaleProducts() {
  this.subscription = this.http.get<any[]>(`http://shopbag.runasp.net/api/Admin/Products`).subscribe({
    next: (data) => {
      const productsArray = Array.isArray(data) ? data : (data as any).products || [];

      this.products = productsArray
        .filter((p: any) => p.discount > 0)
        .slice(0, 4)
        .map((product: any) => {
          return {
            ...product, 
            // priceAfterDiscount
            priceAfterDiscount: product.price - (product.price * (product.discount / 100))
          };
        });
    },
    error: (err) => console.error('Error:', err)
  });
}

  startTimer() {
    this.timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const diff = this.targetDate - now;
      if (diff <= 0) { clearInterval(this.timerInterval); return; }
      this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((diff % (1000 * 60)) / (1000 * 60));  
      this.seconds = Math.floor((diff % (1000 * 60)) / 1000);
    }, 1000);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  
  addToCart(product: any) {

  // CHECK LOGIN
  if (!this.globalService.isAuthenticated()) {

    this.toaster.show(
      'Please login or register to add products to cart.',
      'info'
    );

    return;
  }

  this.cartService.addToCart(product.id).subscribe({

    next: () => {

      this.toaster.show(
        `${product.name} added to cart!`,
        'success'
      );

      this.refreshCartCount();

    },

    error: () => {

      this.toaster.show(
        'Could not add product to cart.',
        'error'
      );

    }

  });

}
  private refreshCartCount() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartService.updateCount(items.length);
    });
  }
}