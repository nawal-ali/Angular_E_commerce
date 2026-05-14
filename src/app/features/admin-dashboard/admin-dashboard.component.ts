import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { ToasterService } from '../../shared/components/toaster/toaster.service';

type AdminTab = 'users' | 'products' | 'brands' | 'categories' | 'statistics';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  selectedTab: AdminTab = 'users';
  isLoading = false;
  isSaving = false;
  showForm = false;
  editingId: number | null = null;

  users: any[] = [];
  products: any[] = [];
  brands: any[] = [];
  categories: any[] = [];
  stats: any[] = [];

  readonly imageBase = 'http://shopbag.runasp.net/Images/';

  productForm = {
    name: '', description: '', price: 0,
    quantity: 1, discount: 0, categoryId: 0, brandId: 0, status: true
  };
  productImageFile: File | null = null;
  productImagePreview: string | null = null;
  editingProductMainImg = '';

  brandForm = { name: '', description: '', status: true };
  categoryForm = { name: '', description: '', status: true };

  pendingDelete: { id: number; type: 'brand' | 'category'; name: string; linkedCount: number } | null = null;

  @ViewChild('deleteModal') deleteModalRef!: ElementRef;
  private bsModal: any;

  menuItems: { key: AdminTab; label: string; icon: string }[] = [
    { key: 'users',      label: 'Users',            icon: 'fa-users' },
    { key: 'products',   label: 'Products',          icon: 'fa-box' },
    { key: 'brands',     label: 'Brands',            icon: 'fa-tag' },
    { key: 'categories', label: 'Categories',        icon: 'fa-layer-group' },
    { key: 'statistics', label: 'System Statistics', icon: 'fa-chart-bar' },
  ];

  constructor(
    private adminService: AdminService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadProducts();
    this.loadBrands();
    this.loadCategories();
  }

  selectTab(tab: AdminTab): void {
    this.selectedTab = tab;
    this.cancelForm();
    if (tab === 'users')           this.loadUsers();
    else if (tab === 'products')   this.loadProducts();
    else if (tab === 'brands')     this.loadBrands();
    else if (tab === 'categories') this.loadCategories();
    else if (tab === 'statistics') this.loadStatistics();
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.productImageFile = null;
    this.productImagePreview = null;
  }

  // ── Users ────────────────────────────────────────────────────────────────────
  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getUsers().subscribe({
      next: d => { this.users = d; this.isLoading = false; },
      error: () => { this.toaster.show('Failed to load users.', 'error'); this.isLoading = false; }
    });
  }

  toggleUserLock(user: any): void {
    this.adminService.toggleUserLock(user.id).subscribe({
      next: () => this.toaster.show(`Lock status toggled for ${user.name || user.userName}.`, 'success'),
      error: () => this.toaster.show('Failed to toggle user lock.', 'error')
    });
  }

  // ── Products ─────────────────────────────────────────────────────────────────
  loadProducts(): void {
    this.isLoading = true;
    this.adminService.getProducts().subscribe({
      next: d => { this.products = d; this.isLoading = false; },
      error: () => { this.toaster.show('Failed to load products.', 'error'); this.isLoading = false; }
    });
  }

  openAddProduct(): void {
    this.editingId = null;
    this.productForm = { name: '', description: '', price: 0, quantity: 1, discount: 0, categoryId: 0, brandId: 0, status: true };
    this.productImageFile = null;
    this.productImagePreview = null;
    this.editingProductMainImg = '';
    this.showForm = true;
  }

  openEditProduct(p: any): void {
    this.editingId = p.id;
    this.productForm = {
      name: p.name,
      description: p.description ?? '',
      price: p.price,
      quantity: p.quantity,
      discount: p.discount,
      categoryId: this.idByName(this.categories, p.categoryName),
      brandId:    this.idByName(this.brands,      p.brandName),
      status: p.status ?? true
    };
    this.editingProductMainImg = p.mainImg;
    this.productImageFile = null;
    this.productImagePreview = null;
    this.showForm = true;
  }

  private idByName(list: any[], name: string): number {
    return list.find(i => i.name === name)?.id ?? 0;
  }

  onProductImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.productImageFile = file;
    const reader = new FileReader();
    reader.onload = () => { this.productImagePreview = reader.result as string; };
    reader.readAsDataURL(file);
  }

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
      ? this.adminService.updateProduct(this.editingId, fd)
      : this.adminService.createProduct(fd);

    req.subscribe({
      next: () => {
        this.toaster.show(this.editingId ? 'Product updated successfully.' : 'Product created successfully.', 'success');
        this.isSaving = false;
        this.cancelForm();
        this.loadProducts();
      },
      error: () => { this.toaster.show('Failed to save product.', 'error'); this.isSaving = false; }
    });
  }

  deleteProduct(p: any): void {
    if (!confirm(`Delete product "${p.name}"? This cannot be undone.`)) return;
    this.adminService.deleteProduct(p.id).subscribe({
      next: () => {
        this.toaster.show('Product deleted.', 'success');
        this.products = this.products.filter(x => x.id !== p.id);
      },
      error: () => this.toaster.show('Failed to delete product.', 'error')
    });
  }

  // ── Brands ───────────────────────────────────────────────────────────────────
  loadBrands(): void {
    this.isLoading = true;
    this.adminService.getBrands().subscribe({
      next: d => { this.brands = d; this.isLoading = false; },
      error: () => { this.toaster.show('Failed to load brands.', 'error'); this.isLoading = false; }
    });
  }

  openAddBrand(): void {
    this.editingId = null;
    this.brandForm = { name: '', description: '', status: true };
    this.showForm = true;
  }

  openEditBrand(b: any): void {
    this.editingId = b.id;
    this.brandForm = { name: b.name, description: b.description ?? '', status: b.status };
    this.showForm = true;
  }

  saveBrand(): void {
    if (!this.brandForm.name.trim()) {
      this.toaster.show('Brand name is required.', 'error'); return;
    }
    this.isSaving = true;
    const req = this.editingId
      ? this.adminService.updateBrand(this.editingId, this.brandForm)
      : this.adminService.createBrand(this.brandForm);

    req.subscribe({
      next: () => {
        this.toaster.show(this.editingId ? 'Brand updated.' : 'Brand created.', 'success');
        this.isSaving = false;
        this.cancelForm();
        this.loadBrands();
      },
      error: (err: any) => {
        const msg = err?.error?.[0]?.errorMessage || err?.error?.message || 'Failed to save brand.';
        this.toaster.show(msg, 'error');
        this.isSaving = false;
      }
    });
  }

  confirmDeleteBrand(b: any): void {
    const linkedCount = this.products.filter(p => p.brandName === b.name).length;
    this.pendingDelete = { id: b.id, type: 'brand', name: b.name, linkedCount };
    this.openDeleteModal();
  }

  // ── Categories ───────────────────────────────────────────────────────────────
  loadCategories(): void {
    this.isLoading = true;
    this.adminService.getCategories().subscribe({
      next: d => { this.categories = d; this.isLoading = false; },
      error: () => { this.toaster.show('Failed to load categories.', 'error'); this.isLoading = false; }
    });
  }

  openAddCategory(): void {
    this.editingId = null;
    this.categoryForm = { name: '', description: '', status: true };
    this.showForm = true;
  }

  openEditCategory(c: any): void {
    this.editingId = c.id;
    this.categoryForm = { name: c.name, description: c.description ?? '', status: c.status };
    this.showForm = true;
  }

  saveCategory(): void {
    if (!this.categoryForm.name.trim()) {
      this.toaster.show('Category name is required.', 'error'); return;
    }
    this.isSaving = true;
    const req = this.editingId
      ? this.adminService.updateCategory(this.editingId, this.categoryForm)
      : this.adminService.createCategory(this.categoryForm);

    req.subscribe({
      next: () => {
        this.toaster.show(this.editingId ? 'Category updated.' : 'Category created.', 'success');
        this.isSaving = false;
        this.cancelForm();
        this.loadCategories();
      },
      error: () => { this.toaster.show('Failed to save category.', 'error'); this.isSaving = false; }
    });
  }

  confirmDeleteCategory(c: any): void {
    const linkedCount = this.products.filter(p => p.categoryName === c.name).length;
    this.pendingDelete = { id: c.id, type: 'category', name: c.name, linkedCount };
    this.openDeleteModal();
  }

  // ── Statistics ────────────────────────────────────────────────────────────────
  loadStatistics(): void {
    this.isLoading = true;
    this.adminService.getStatistics().subscribe({
      next: d => { this.stats = d; this.isLoading = false; },
      error: () => { this.toaster.show('Failed to load statistics.', 'error'); this.isLoading = false; }
    });
  }

  get maxProductCount(): number {
    return this.stats.reduce((m, s) => Math.max(m, s.count), 1);
  }

  // ── Delete modal ──────────────────────────────────────────────────────────────
  private openDeleteModal(): void {
    const el = this.deleteModalRef?.nativeElement;
    if (!el) return;
    this.bsModal = new (window as any).bootstrap.Modal(el);
    this.bsModal.show();
  }

  closeDeleteModal(): void {
    this.bsModal?.hide();
    this.pendingDelete = null;
  }

  executeDelete(): void {
    if (!this.pendingDelete) return;
    const { id, type } = this.pendingDelete;
    const req = type === 'brand'
      ? this.adminService.deleteBrand(id)
      : this.adminService.deleteCategory(id);

    req.subscribe({
      next: () => {
        this.toaster.show(`${type === 'brand' ? 'Brand' : 'Category'} deleted successfully.`, 'success');
        this.closeDeleteModal();
        if (type === 'brand') { this.loadBrands(); this.loadProducts(); }
        else                  { this.loadCategories(); this.loadProducts(); }
      },
      error: () => { this.toaster.show('Delete failed.', 'error'); this.closeDeleteModal(); }
    });
  }
  brandProductCount(brandName: string): number {
  return this.products.filter(p => p.brandName === brandName).length;
}

categoryProductCount(categoryName: string): number {
  return this.products.filter(p => p.categoryName === categoryName).length;
}
}