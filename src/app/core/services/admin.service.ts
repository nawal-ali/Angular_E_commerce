import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = 'http://shopbag.runasp.net/api/Admin';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/users`);
  }

  toggleUserLock(id: string): Observable<any> {
    return this.http.patch(`${this.base}/users/${id}`, {});
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/products`);
  }

  createProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.base}/products`, formData);
  }

  updateProduct(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.base}/products/${id}`, formData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.base}/products/${id}`);
  }

  getBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/brands`);
  }

  createBrand(data: any): Observable<any> {
    return this.http.post(`${this.base}/brands`, data);
  }

  updateBrand(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/brands/${id}`, data);
  }

  deleteBrand(id: number): Observable<any> {
    return this.http.delete(`${this.base}/brands/${id}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/categories`);
  }

  createCategory(data: any): Observable<any> {
    return this.http.post(`${this.base}/categories`, data);
  }

  updateCategory(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/categories/${id}`, data);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.base}/categories/${id}`);
  }

  getStatistics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/statistics`);
  }

  getOrders(): Observable<any> {
    return this.http.get<any>(`${this.base}/Orders`);
  }

}