import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SellerService {

  private base = 'http://shopbag.runasp.net/api/Seller/Products';

  constructor(private http: HttpClient) {}

  getMyProducts()                      { return this.http.get<any[]>(this.base); }
  getProduct(id: number)               { return this.http.get<any>(`${this.base}/${id}`); }
  createProduct(fd: FormData)          { return this.http.post(this.base, fd); }
  updateProduct(id: number, fd: FormData) { return this.http.put(`${this.base}/${id}`, fd); }
  deleteProduct(id: number)            { return this.http.delete(`${this.base}/${id}`); }
}