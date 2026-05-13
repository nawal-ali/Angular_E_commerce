
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from '@angular/router';
import { ToasterService } from '../../shared/components/toaster/toaster.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  items: any[] = [];

  constructor(private cartService: CartService, private toaster: ToasterService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCartItems().subscribe({
      next: (data:any) => {
        this.items = data.cart;
        console.log(this.items);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getTotal() {
    return Math.round(this.items.reduce(
      (acc, item) => acc + (item.product.price * item.count),
      0
    ) );
  }

  updateQty(item: any, change: number) {

  if (change > 0) {

    this.cartService.incrementQty(item.productId)
      .subscribe(() => {

        this.loadCart();

        this.toaster.show(
          `${item.product.name} quantity increased`,
          'success'
        );

      });

  } else {

    // if quantity is 1 remove item
    if (item.count === 1) {

      this.removeItem(item.productId);
      return;
    }

    this.cartService.decrementQty(item.productId)
      .subscribe(() => {

        this.loadCart();

        this.toaster.show(
          `${item.product.name} quantity decreased`,
          'info'
        );

      });
  }
}
removeItem(productId: number) {

  const item = this.items.find(
    x => x.productId === productId
  );

  this.cartService.removeItem(productId)
    .subscribe(() => {

      this.loadCart();

      this.toaster.show(
        `${item?.product?.name || 'Product'} removed from cart`,
        'info'
      );

    });
}
}