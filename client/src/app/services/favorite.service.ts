import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

export interface Favorite {
  _id: string;
  user: string;
  product: Product;
  addedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = `${environment.apiUrl}/favorites`;

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(this.apiUrl);
  }

  addToFavorites(productId: string): Observable<Favorite> {
    return this.http.post<Favorite>(this.apiUrl, { productId });
  }

  removeFromFavorites(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }

  checkIsFavorite(productId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${productId}`);
  }
} 