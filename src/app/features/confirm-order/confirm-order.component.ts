import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-order',
  imports: [CommonModule],
  templateUrl: './confirm-order.component.html',
  styleUrl: './confirm-order.component.css'
})
export class ConfirmOrderComponent {

  showSuccessModal: boolean = false;
 @Input() isVisible: boolean = false;
  @Input() totalPrice: number = 0; 
  @Input() paymentMethod: string = ''; 
  @Input() cardLastFour: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
 

 orderId: number = 0; 

  ngOnInit() {
     this.orderId = Math.floor(Math.random() * 100000);
  }

  onCancel() {
    this.close.emit();
  }

  onPay() {
    this.confirm.emit();
  }
}
