import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 
  private baseUrl ='http://shopbag.runasp.net/api/Customer/Carts';
  
   
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  constructor(private http: HttpClient) {}

  
  getCartItems() {
    return this.http.get<any[]>(this.baseUrl);
  }

   
  addToCart(productId: number) {
    return this.http.post(this.baseUrl, { productId, quantity: 1 }).pipe(
      switchMap(() => this.incrementQty(productId))
    );
  }

  
  incrementQty(productId: number) {
    return this.http.patch(`${this.baseUrl}/IncrementCart/${productId}`, {});
  }
 
  decrementQty(productId: number) {
    return this.http.patch(`${this.baseUrl}/DecrementCart/${productId}`, {});
  }

  
  removeItem(productId: number) {
    return this.http.delete(`${this.baseUrl}/${productId}`);
  }
 
  updateCount(count: number) {
    this.cartCount.next(count);
  }
  
  placeOrder(transactionType: string): Observable<any> {
    return this.http.post(`http://shopbag.runasp.net/api/Customer/Orders`, { transactionType });
  }
 
}