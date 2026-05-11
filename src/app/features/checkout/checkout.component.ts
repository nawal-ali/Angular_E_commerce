import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: any[] = [];

  constructor(private fb: FormBuilder, private cartService: CartService) {}

  ngOnInit(): void {
    // 1. بناء الفورم مع الـ Validation
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      paymentMethod: ['cod', Validators.required]
    });

    // 2. جلب المنتجات بشكل dynamic
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  // اختصار للوصول للحقول في الـ HTML
  get f() { return this.checkoutForm.controls; }

  getSubtotal() {
    return this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      console.log('Order Submitted Successfully:', this.checkoutForm.value);
      alert('Congratulations! Your order has been placed.');
      // هنا ممكن تنادي على API الدفع اللي في الصورة السابقة (Pay)
    } else {
      Object.keys(this.checkoutForm.controls).forEach(field => {
        const control = this.checkoutForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
}