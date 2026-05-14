 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { ToasterService } from '../../shared/components/toaster/toaster.service';
import { Modal } from 'bootstrap';

interface ProductResponse {
  id: number;
  name: string;
  description: string;
  mainImg: string;
  price: number;
  rate: number;
  discount: number;
}

interface WishlistItem {
  productId: number;
  addedAt: string;
  product: ProductResponse;
}

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {

  wishlistItems: WishlistItem[] = [];
  isLoading = true;
  isClearing = false;
  removingIds = new Set<number>();
  addingToCartIds = new Set<number>();
  skeletons = [1, 2, 3, 4];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (res: any) => {
        this.wishlistItems = res.wishlist ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.toaster.show('Failed to load wishlist.', 'error');
        this.isLoading = false;
      }
    });
  }

  removeFromWishlist(productId: number): void {
    this.removingIds.add(productId);
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        setTimeout(() => {
          this.wishlistItems = this.wishlistItems.filter(i => i.productId !== productId);
          this.removingIds.delete(productId);
          this.toaster.show('Item removed from wishlist.', 'info');
        }, 300);
      },
      error: () => {
        this.removingIds.delete(productId);
        this.toaster.show('Could not remove item. Try again.', 'error');
      }
    });
  }

  confirmClear(): void {
    const el = document.getElementById('clearModal');
    if (el) new Modal(el).show();
  }

  clearWishlist(): void {
    this.isClearing = true;
    this.wishlistService.clearWishlist().subscribe({
      next: () => {
        this.wishlistItems = [];
        this.isClearing = false;
        this.toaster.show('Wishlist cleared successfully.', 'success');
      },
      error: () => {
        this.isClearing = false;
        this.toaster.show('Could not clear wishlist. Try again.', 'error');
      }
    });
  }

  addToCart(productId: number): void {
    this.addingToCartIds.add(productId);
    this.cartService.addToCart(productId).subscribe({
      next: () => {
        this.addingToCartIds.delete(productId);
        this.toaster.show('Added to cart!', 'success');
      },
      error: () => {
        this.addingToCartIds.delete(productId);
        this.toaster.show('Could not add to cart. Try again.', 'error');
      }
    });
  }

  getDiscountedPrice(price: number, discount: number): number {
    if (!discount) return price;
    return +(price - (price * discount / 100)).toFixed(2);
  }

  getStars(rate: number): string[] {
    const stars: string[] = [];
    const full = Math.floor(rate);
    const half = rate % 1 >= 0.5 ? 1 : 0;
    for (let i = 0; i < full; i++) stars.push('full');
    if (half) stars.push('half');
    while (stars.length < 5) stars.push('empty');
    return stars;
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/placeholder.png';
  }

  isRemoving(productId: number): boolean {
    return this.removingIds.has(productId);
  }

  isAddingToCart(productId: number): boolean {
    return this.addingToCartIds.has(productId);
  }
}