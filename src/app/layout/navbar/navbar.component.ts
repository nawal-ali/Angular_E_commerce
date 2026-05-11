import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { ToasterService } from '../../shared/components/toaster/toaster.service';
import { CartComponent } from '../../features/cart/cart.component';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive , CartComponent] ,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public globalService: GlobalService, private toaster: ToasterService ,private cartService: CartService){}

   cartCount: number = 0; 

  
  ngOnInit(): void {
     this.cartService.cartCount$.subscribe((count: number) => {
      this.cartCount = count;
    });
  }

  handleLogout(){
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.globalService.isLoggedIn();
    this.toaster.show('Logged out successfully', 'success');
  }

  isCartVisible = false;
 
  cartData = [
 
  ];

  toggleCart() {
    this.isCartVisible = !this.isCartVisible;
  }
  
}
