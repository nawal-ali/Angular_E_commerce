import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription, map } from 'rxjs';
import { FilterModalComponent } from '../../features/filter-modal/filter-modal.component';


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
  mainImg: string;
  categoryName: string;
  priceAfterDiscount?: number;
}

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule ,FilterModalComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);


  // الروابط الأساسية للـ APIs
  private categoriesApiUrl = 'http://shopbag.runasp.net/api/Admin/Categories';
  private productsApiUrl = 'http://shopbag.runasp.net/api/Admin/Products';
  
  categories: Category[] = [];
  products: Product[] = [];
 
  selectedCategoryId: number | null = null;

  private categoriesSub?: Subscription;
  private productsSub?: Subscription;

  brands: any[] = [];
  isFilterVisible: boolean = false;  

 filterState = {
    selectedBrands: [] as string[],
    priceRange: null as { min: number, max: number } | null 
  };

  ngOnInit() {
    this.getAllCategories();
    this.getAllProducts();
    // this.loadInitialData();
  }


// get all categories 
  getAllCategories() {
    this.categoriesSub = this.http.get<Category[]>(this.categoriesApiUrl).subscribe({
      next: (data) => {
        this.categories = data;
      
        this.selectedCategoryId = null; 
      },
      error: (err) => console.error('Error fetching categories:', err)
    });
  }


// get all products 
  getAllProducts() {
    this.productsSub = this.http.get<Product[]>(this.productsApiUrl)
      .pipe(
      
        map(products => products.map(product => {
          return {
            ...product,
            priceAfterDiscount: parseFloat((product.price - (product.price * (product.discount / 100))).toFixed(2))
          };
        }))
      )
      .subscribe({
        next: (data) => {
          this.products = data;
        },
        error: (err) => console.error('Error fetching products:', err)
      });
  }


// get category by id 
  selectCategory(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
  }


// filter products  by category 
  get filteredProducts(): Product[] {
    let result = [...this.products];

    // 1. filter by Category
    if (this.selectedCategoryId !== null) {
      const selectedCategory = this.categories.find(c => c.id === this.selectedCategoryId);
      if (selectedCategory) {
        result = result.filter(p => p.categoryName === selectedCategory.name);
      }
    }

    // 2. search by name
    if (this.searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(this.searchTerm));
    }

    // 3. sort by price
    if (this.sortOption === 'high') {
      result.sort((a, b) => (b.priceAfterDiscount ?? 0) - (a.priceAfterDiscount ?? 0));
    } else if (this.sortOption === 'low') {
      result.sort((a, b) => (a.priceAfterDiscount ?? 0) - (b.priceAfterDiscount ?? 0));
    }
 

    // 4. filter by price 
    if (this.filterState.priceRange) {
      result = result.filter(p => {
        const price = p.priceAfterDiscount ?? p.price;
        return price >= this.filterState.priceRange!.min && price <= this.filterState.priceRange!.max;
      });
    }

    // 5. filter by brands
    if (this.filterState.selectedBrands.length > 0) {
      result = result.filter(p => this.filterState.selectedBrands.includes(p.categoryName));
    }

    return result;
  }

  ngOnDestroy() {
    this.categoriesSub?.unsubscribe();
    this.productsSub?.unsubscribe();
  }

  searchTerm: string = '';  
  sortOption: string = 'relevance';  

  // search function 
  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
  }

   // sort function 
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
 
}