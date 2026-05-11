import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule,RouterModule], 
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  ngOnInit(): void {
    this.loadCart();
  }

  @Input() isOpen: boolean = false;
  @Input() items: any[] = []; 
  @Output() closeCart = new EventEmitter<void>(); 
  
  constructor(private cartService: CartService) {}

  onClose() {
    this.closeCart.emit();
  }

  getTotal() {
    return this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }
 
  // cart-sidebar.component.ts
loadCart() {
  this.cartService.getCartItems().subscribe(data => this.items = data);
}

updateQty(item: any, change: number) {
  if (change > 0) {
    this.cartService.incrementQty(item.productId).subscribe(() => this.loadCart());
  } else {
    this.cartService.decrementQty(item.productId).subscribe(() => this.loadCart());
  }
}

removeItem(productId: number) {
  this.cartService.removeItem(productId).subscribe(() => {
    this.loadCart(); //           
  });
}
}
