import { Component } from '@angular/core';
import { FlashSaleComponent } from '../../features/flash-sale/flash-sale.component';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-home',
  imports: [FlashSaleComponent ,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
