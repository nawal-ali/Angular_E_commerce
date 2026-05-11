import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private http : HttpClient) { }

  baseUrl = 'http://shopbag.runasp.net/api/Customer/Wishlists';

  getWishlist() {
    return this.http.get(this.baseUrl);
  }

  addToWishlist(productId: number) {
    return this.http.post(`${this.baseUrl}/${productId}`, {});
  }

  removeFromWishlist(productId: number) {
    return this.http.delete(`${this.baseUrl}/${productId}`);
  }

  clearWishlist() {
    return this.http.delete(`${this.baseUrl}/Clear`);
  }

  checkInWishlist(productId: number) {
    return this.http.get<{ isInWishlist: boolean }>(`${this.baseUrl}/Check/${productId}`);
  }
}
