import { Component } from '@angular/core';
import { FlashSaleComponent } from '../../features/flash-sale/flash-sale.component';



@Component({
  selector: 'app-home',
  imports: [FlashSaleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
