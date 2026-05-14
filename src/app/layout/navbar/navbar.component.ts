import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';
import { ToasterService } from '../../shared/components/toaster/toaster.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  cartCount: number = 0;

  constructor(
    public globalService: GlobalService,
    private toaster: ToasterService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe((count: number) => {
      this.cartCount = count;
    });
    this.loadCartCount();
  }

  loadCartCount() {
    this.cartService.getCartItems().subscribe({
      next: (res: any) => {
        const count = res.cart?.length || 0;
        this.cartService.updateCount(count);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.toaster.show('Logged out successfully', 'success');
  }

  // Closes mobile collapse layout seamlessly during client routing transitions
  closeNav(navMenu: HTMLElement) {
    console.log(navMenu);
    // if (navMenu.classList.contains('show')) {
    //   navMenu.classList.remove('show');
    // }
    navMenu.classList.toggle('show');
  }
}
