import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToasterService } from '../../shared/components/toaster/toaster.service';
import { HttpClient } from '@angular/common/http';
import { SellerService } from '../../core/services/seller.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css'
})
export class SellerDashboardComponent implements OnInit {

  readonly imageBase = 'http://shopbag.runasp.net/Images/';

  products:   any[] = [];
  categories: any[] = [];
  brands:     any[] = [];

  isLoading = false;
  isSaving  = false;
  showForm  = false;
  editingId: number | null = null;

  productForm = {
    name: '', description: '', price: 0,
    quantity: 1, discount: 0,
    categoryId: 0, brandId: 0, status: true
  };

  productImageFile:    File | null   = null;
  productImagePreview: string | null = null;
  editingMainImg = '';

  constructor(
    private sellerService: SellerService,
    private toaster: ToasterService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadBrands();
  }

  // ── Data loading ────────────────────────────────────────────────────────────
  loadProducts(): void {
    this.isLoading = true;
    this.sellerService.getMyProducts().subscribe({
      next:  d  => { this.products = d; this.isLoading = false; },
      error: () => { this.toaster.show('Failed to load your products.', 'error'); this.isLoading = false; }
    });
  }

  loadCategories(): void {
    this.http.get<any[]>('http://shopbag.runasp.net/api/Admin/Categories').subscribe({
      next: d => this.categories = d,
      error: () => {}
    });
  }

  loadBrands(): void {
    this.http.get<any[]>('http://shopbag.runasp.net/api/Admin/Brands').subscribe({
      next: d => this.brands = d,
      error: () => {}
    });
  }

  // ── Form helpers ────────────────────────────────────────────────────────────
  openAddProduct(): void {
    this.editingId = null;
    this.productForm = { name: '', description: '', price: 0, quantity: 1, discount: 0, categoryId: 0, brandId: 0, status: true };
    this.productImageFile = null;
    this.productImagePreview = null;
    this.editingMainImg = '';
    this.showForm = true;
  }

  openEditProduct(p: any): void {
    this.editingId = p.id;
    this.productForm = {
      name:        p.name,
      description: p.description ?? '',
      price:       p.price,
      quantity:    p.quantity,
      discount:    p.discount,
      categoryId:  this.idByName(this.categories, p.categoryName),
      brandId:     this.idByName(this.brands, p.brandName),
      status:      p.status ?? true
    };
    this.editingMainImg = p.mainImg;
    this.productImageFile = null;
    this.productImagePreview = null;
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.productImageFile = null;
    this.productImagePreview = null;
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.productImageFile = file;
    const reader = new FileReader();
    reader.onload = () => { this.productImagePreview = reader.result as string; };
    reader.readAsDataURL(file);
  }

  // ── Save ────────────────────────────────────────────────────────────────────
  saveProduct(): void {
    if (!this.productForm.name.trim() || this.productForm.price <= 0) {
      this.toaster.show('Name and a valid price are required.', 'error'); return;
    }
    if (!this.editingId && !this.productImageFile) {
      this.toaster.show('Product image is required for new products.', 'error'); return;
    }

    const fd = new FormData();
    fd.append('Name',        this.productForm.name);
    fd.append('Description', this.productForm.description);
    fd.append('Price',       this.productForm.price.toString());
    fd.append('Quantity',    this.productForm.quantity.toString());
    fd.append('Discount',    this.productForm.discount.toString());
    fd.append('CategoryId',  this.productForm.categoryId.toString());
    fd.append('BrandId',     this.productForm.brandId.toString());
    fd.append('Status',      this.productForm.status.toString());
    if (this.productImageFile) fd.append('MainImg', this.productImageFile);

    this.isSaving = true;
    const req = this.editingId
      ? this.sellerService.updateProduct(this.editingId, fd)
      : this.sellerService.createProduct(fd);

    req.subscribe({
      next: () => {
        this.toaster.show(this.editingId ? 'Product updated.' : 'Product created.', 'success');
        this.isSaving = false;
        this.cancelForm();
        this.loadProducts();
      },
      error: () => { this.toaster.show('Failed to save product.', 'error'); this.isSaving = false; }
    });
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  deleteProduct(p: any): void {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    this.sellerService.deleteProduct(p.id).subscribe({
      next: () => {
        this.toaster.show('Product deleted.', 'success');
        this.products = this.products.filter(x => x.id !== p.id);
      },
      error: () => this.toaster.show('Failed to delete product.', 'error')
    });
  }

  // ── Utility ─────────────────────────────────────────────────────────────────
  private idByName(list: any[], name: string): number {
    return list.find(i => i.name === name)?.id ?? 0;
  }

  getDiscountedPrice(price: number, discount: number): number {
    return +(price - price * discount / 100).toFixed(2);
  }

  get activeCount(): number {
  return this.products.filter(p => p.status).length;
}

get discountedCount(): number {
  return this.products.filter(p => p.discount > 0).length;
}
}