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
  showThankYouModal: boolean = false;
 
checkoutForm = new FormGroup({

    firstName: new FormControl('',
       [Validators.required,
       Validators.minLength(3)]),

    lastName: new FormControl('', [
        Validators.required ,
       Validators.minLength(3)] ,),

    address: new FormControl('', 
      [Validators.required , 
       Validators.pattern(/^[a-zA-Z0-9\s,.-]*$/),]),


    cardNumber: new FormControl('', 
      [Validators.pattern('^[0-9]{16}$')]),

    expiry: new FormControl('',
       [Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{2})$')]),

    cvv: new FormControl('', [Validators.pattern('^[0-9]{3}$')])

  });
  constructor(
    private _cartService: CartService,
    private toaster: ToasterService,
    private router: Router
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
    return Math.round(this.checkoutItems.reduce(
      (acc, item) => acc + (item.product.price * item.count),
      0
    ));
  }

  selectPayment(method: string) {
    this.paymentMethod = method;
  }

  goToStep(step: string) {
    this.currentStep = step;
  }

  showSuccessModal: boolean = false; 

confirmOrder() {
   if (this.checkoutForm.valid || this.paymentMethod === 'cash') {
    console.log("Order Confirmed!", this.checkoutForm.value);
    
     this.showSuccessModal = true; 
  } else {
    this.checkoutForm.markAllAsTouched();
  }
}

//  card number last 4 digits
getLastFourDigits(): string {
  const cardNumber = this.checkoutForm.get('cardNumber')?.value;
  if (cardNumber && cardNumber.length >= 4) {
     return cardNumber.slice(-4);
  }
  return '****';   
}

handleFinalPayment() {
  const transactionType = this.paymentMethod === 'online' ? 'Online' : 'Cash';

  this._cartService.placeOrder(transactionType).subscribe({
    next: () => {
      this.showSuccessModal = false;
      this.toaster.show('Order placed successfully!', 'success');
      this.router.navigate(['/product']);
    },
    error: (err) => {
      this.toaster.show('Failed to place order. Please try again.', 'error');
      console.error(err);
    }
  });
}
}