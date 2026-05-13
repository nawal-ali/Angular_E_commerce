import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ToasterService } from '../../shared/components/toaster/toaster.service';

interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  rate: number;
  brandName: string;
  mainImg: string;
  categoryName: string;
  priceAfterDiscount?: number;
}
@Component({
  selector: 'app-single-product',
  standalone :true,
   imports: [CommonModule, RouterLink],
  templateUrl: './single-product.component.html',
  styleUrl: './single-product.component.css'
})
export class SingleProductComponent implements OnInit {
 
  product: any; 
  // --- Wishlist state ---
  wishlistedIds = new Set<number>();
  pendingWishlistIds = new Set<number>();
   products: Product[] = [];


  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient ,
    private cartService: CartService,
      private wishlistService: WishlistService,
      private toaster: ToasterService
  ) {}


  selectedSize: string = 'M'; 
  selectedColor: string = '#042433';  
  
  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL'];
  colors: string[] = ['#26e0b3', '#2bb6e6', '#042433'];


  selectSize(size: string) {
    this.selectedSize = size;
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getProductDetails(id);
    }
    this.loadWishlistedIds();
  }

  getProductDetails(id: string) {
    this.http.get<any>(`http://shopbag.runasp.net/api/Admin/Products/${id}`)
      .subscribe({
        next: (data) => {
          this.product = data;
          console.log('Product Details:', this.product);
        },
        error: (err) => console.error('Error fetching product:', err)
      });
  }
  

addToCart() {
  this.cartService.addToCart(this.product.id).subscribe({
    next: () => {
      alert('تمت الإضافة بنجاح!');
       this.cartService.getCartItems().subscribe(items => {
        this.cartService.updateCount(items.length);
      });
    }
  });
}

 loadWishlistedIds(): void {
    this.wishlistService.getWishlist().subscribe({
      next: (res: any) => {
        const items = res.wishlist ?? [];
        this.wishlistedIds = new Set(items.map((i: any) => i.productId));
      },
      error: () => {} // silently ignore if user not logged in
    });
  }

  toggleWishlist(product: Product): void {
    if (this.pendingWishlistIds.has(product.id)) return;

    this.pendingWishlistIds.add(product.id);

    if (this.wishlistedIds.has(product.id)) {
      // Already wishlisted → remove
      this.wishlistService.removeFromWishlist(product.id).subscribe({
        next: () => {
          this.wishlistedIds.delete(product.id);
          this.pendingWishlistIds.delete(product.id);
          this.toaster.show(`${product.name} removed from wishlist.`, 'info');
        },
        error: () => {
          this.pendingWishlistIds.delete(product.id);
          this.toaster.show('Could not update wishlist. Try again.', 'error');
        }
      });
    } else {
      // Not wishlisted → add
      this.wishlistService.addToWishlist(product.id).subscribe({
        next: () => {
          this.wishlistedIds.add(product.id);
          this.pendingWishlistIds.delete(product.id);
          this.toaster.show(`${product.name} added to wishlist!`, 'success');
        },
        error: () => {
          this.pendingWishlistIds.delete(product.id);
          this.toaster.show('Could not update wishlist. Try again.', 'error');
        }
      });
    }
  }

  isWishlisted(productId: number): boolean {
    return this.wishlistedIds.has(productId);
  }

  isPendingWishlist(productId: number): boolean {
    return this.pendingWishlistIds.has(productId);
  }

  }