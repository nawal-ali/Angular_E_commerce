import { Component, OnInit, inject, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription, map } from 'rxjs';
import { FilterModalComponent } from '../../features/filter-modal/filter-modal.component';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ToasterService } from '../../shared/components/toaster/toaster.service';

interface Category {
  id: number;
  name: string;
}

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
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule, FilterModalComponent, RouterLink],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);

  private categoriesApiUrl = 'http://shopbag.runasp.net/api/Admin/Categories';
  private productsApiUrl = 'http://shopbag.runasp.net/api/Admin/Products';

  categories: Category[] = [];
  products: Product[] = [];
  selectedCategoryId: number | null = null;

  private categoriesSub?: Subscription;
  private productsSub?: Subscription;

  @Input() brands: any[] = [];
  isFilterVisible: boolean = false;

  filterState = {
    selectedBrands: [] as string[],
    priceRange: null as { min: number, max: number } | null
  };

  // --- Wishlist state ---
  wishlistedIds = new Set<number>();
  pendingWishlistIds = new Set<number>();

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toaster: ToasterService
  ) {}

  ngOnInit() {
    this.getAllCategories();
    this.getAllProducts();
    this.loadWishlistedIds();
  }

  // Fetch which products are already wishlisted so hearts render correctly
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

  // --- Existing methods unchanged below ---

  getAllCategories() {
    this.categoriesSub = this.http.get<Category[]>(this.categoriesApiUrl).subscribe({
      next: (data) => {
        this.categories = data;
        this.selectedCategoryId = null;
      },
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  getAllProducts() {
    this.productsSub = this.http.get<Product[]>(this.productsApiUrl)
      .pipe(
        map(products => products.map(product => ({
          ...product,
          priceAfterDiscount: parseFloat((product.price - (product.price * (product.discount / 100))).toFixed(2))
        })))
      )
      .subscribe({
        next: (data) => { this.products = data; },
        error: (err) => console.error('Error fetching products:', err)
      });
  }

  selectCategory(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
  }

  get filteredProducts(): Product[] {
    let result = [...this.products];

    if (this.selectedCategoryId !== null) {
      const selectedCategory = this.categories.find(c => c.id === this.selectedCategoryId);
      if (selectedCategory) {
        result = result.filter(p => p.categoryName === selectedCategory.name);
      }
    }

    if (this.searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(this.searchTerm));
    }

    if (this.sortOption === 'high') {
      result.sort((a, b) => (b.priceAfterDiscount ?? 0) - (a.priceAfterDiscount ?? 0));
    } else if (this.sortOption === 'low') {
      result.sort((a, b) => (a.priceAfterDiscount ?? 0) - (b.priceAfterDiscount ?? 0));
    }

    if (this.filterState.priceRange) {
      result = result.filter(p => {
        const price = p.priceAfterDiscount ?? p.price;
        return price >= this.filterState.priceRange!.min && price <= this.filterState.priceRange!.max;
      });
    }

    if (this.filterState.selectedBrands.length > 0) {
      result = result.filter(p => this.filterState.selectedBrands.includes(p.brandName));
    }

    return result;
  }

  ngOnDestroy() {
    this.categoriesSub?.unsubscribe();
    this.productsSub?.unsubscribe();
  }

  searchTerm: string = '';
  sortOption: string = 'relevance';

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
  }

  onSort(event: any) {
    this.sortOption = event.target.value;
  }

  loadInitialData() {
    this.http.get<any[]>('http://shopbag.runasp.net/api/Admin/Products').subscribe(res => this.products = res);
    this.http.get<any[]>('http://shopbag.runasp.net/api/Admin/Brands').subscribe(res => this.brands = res);
  }

  handleFilterChange(event: any) {
    this.filterState = event;
  }

  addToCart(product: any) {
    this.cartService.addToCart(product.id).subscribe({
      next: () => {
        this.toaster.show(`${product.name} added to cart!`, 'success');
        this.refreshCartCount();
      }
    });
  }

  private refreshCartCount() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartService.updateCount(items.length);
    });
  }
}