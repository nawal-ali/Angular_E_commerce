import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule,FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmOrderComponent } from '../confirm-order/confirm-order.component';
import { ToasterService } from '../../shared/components/toaster/toaster.service';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule ,ReactiveFormsModule,ConfirmOrderComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutItems: any[] = [];
  paymentMethod: string = 'online';
  currentStep: string = 'info';
  showSuccessModal: boolean = false;

  checkoutForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9\s,.-]*$/)
    ]),
     cardNumber: new FormControl(''),
    expiry: new FormControl(''),
    cvv: new FormControl('')
  });

  constructor(
    private _cartService: CartService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.getCheckoutData();
  }

  getCheckoutData() {
    this._cartService.getCartItems().subscribe({
      next: (data: any) => {
        this.checkoutItems = data.cart;
      },
      error: (err) => console.error('Checkout error:', err)
    });
  }

  calcTotal(): number {
    return Math.round(
      this.checkoutItems.reduce(
        (acc, item) => acc + item.product.price * item.count,
        0
      )
    );
  }

   selectPayment(method: string) {
    this.paymentMethod = method;

    const cardFields = ['cardNumber', 'expiry', 'cvv'];

    if (method === 'online') {
       this.checkoutForm.get('cardNumber')?.setValidators([
        Validators.required,
        Validators.pattern('^[0-9]{16}$')
      ]);
      this.checkoutForm.get('expiry')?.setValidators([
        Validators.required,
        Validators.pattern('^(0[1-9]|1[0-2])/?([0-9]{2})$')
      ]);
      this.checkoutForm.get('cvv')?.setValidators([
        Validators.required,
        Validators.pattern('^[0-9]{3}$')
      ]);
    } else {
       cardFields.forEach(field => {
        this.checkoutForm.get(field)?.clearValidators();
        this.checkoutForm.get(field)?.reset();
      });
    }

     cardFields.forEach(field => {
      this.checkoutForm.get(field)?.updateValueAndValidity();
    });
  }

  goToStep(step: string) {
    this.currentStep = step;
  }

  confirmOrder() {
     if (this.paymentMethod === 'online') {
      this.selectPayment('online');
    }

    if (this.checkoutForm.valid) {
      this.showSuccessModal = true;
    } else {
      this.checkoutForm.markAllAsTouched();

       const step1Invalid = ['firstName', 'lastName', 'address'].some(
        f => this.checkoutForm.get(f)?.invalid
      );
      if (step1Invalid) {
        this.currentStep = 'info';
      }
    }
  }

  getLastFourDigits(): string {
    const cardNumber = this.checkoutForm.get('cardNumber')?.value;
    return cardNumber && cardNumber.length >= 4
      ? cardNumber.slice(-4)
      : '****';
  }

  handleFinalPayment() {
     const finalOrder = {
      firstName: this.checkoutForm.value.firstName,
      lastName: this.checkoutForm.value.lastName,
      address: this.checkoutForm.value.address,
      totalPrice: this.calcTotal(),
      paymentMethod: this.paymentMethod,
      // لو cash مش محتاجين بيانات الكارت
      ...(this.paymentMethod === 'online' && {
        cardLastFour: this.getLastFourDigits()
      })
    };

    this._cartService.placeOrder(finalOrder).subscribe({
      next: (response) => {
        console.log('Order placed:', response);
        this.toaster.show('Order Confirmed Successfully!', 'success');
        this.showSuccessModal = false;
      },
      error: (err) => {
        this.toaster.show('Failed to place order.', 'error');
        console.error(err);
      }
    });
  }
}