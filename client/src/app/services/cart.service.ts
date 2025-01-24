import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private loadCart(): void {
    this.getCart().subscribe({
      next: (cart) => this.cartSubject.next(cart),
      error: (error) => console.error('Sepet yüklenirken hata oluştu:', error)
    });
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  addToCart(productId: string, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/items`, { productId, quantity })
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  removeFromCart(productId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/items/${productId}`)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  updateCartItem(productId: string, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/items/${productId}`, { quantity })
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  clearCart(): Observable<Cart> {
    return this.http.delete<Cart>(this.apiUrl)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  get cartValue(): Cart | null {
    return this.cartSubject.value;
  }

  get itemCount(): number {
    return this.cartValue?.items.reduce((total, item) => total + item.quantity, 0) || 0;
  }
} 