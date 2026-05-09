import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [FormsModule , CommonModule],
  templateUrl: './filter-modal.component.html',
  styleUrl: './filter-modal.component.css'
})

export class FilterModalComponent implements OnInit{
 private http = inject(HttpClient);
  
  // الـ API الخاص بالبراندات
  private brandsApiUrl = 'http://shopbag.runasp.net/api/Admin/Brands';

  @Output() onFilterApplied = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  brands: any[] = [];
  selectedBrands: string[] = [];
  maxPrice: number = 10000;
  selectedRating: number | null = null;

  ngOnInit() {
    this.getBrands();
  }

  getBrands() {
    this.http.get<any[]>(this.brandsApiUrl).subscribe(data => this.brands = data);
  }

  // Checkboxes fot brands 
  onBrandChange(brandName: string, event: any) {
    if (event.target.checked) {
      this.selectedBrands.push(brandName);
    } else {
      this.selectedBrands = this.selectedBrands.filter(b => b !== brandName);
    }
    this.applyFilters();
  }

   selectedPriceRange: { min: number, max: number } | null = null;

 
onPriceChange(min: number, max: number, event: any) {
  if (event.target.checked) {
    this.selectedPriceRange = { min, max };
  } else {
    this.selectedPriceRange = null;
  }
  this.emitFilters();
}

@Output() onFilterChange = new EventEmitter<any>();

emitFilters() {
  
  this.onFilterChange.emit({
    selectedBrands: this.selectedBrands,
    priceRange: this.selectedPriceRange, 
  });
}

  applyFilters() {
    this.onFilterApplied.emit({
      brands: this.selectedBrands,
      price: this.maxPrice,
      rating: this.selectedRating
    });
  }

  closeFilters() {
    this.onClose.emit();
  }
}