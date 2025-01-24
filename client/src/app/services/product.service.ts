import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilterOptions } from './filter.service';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  category: any;
  brand: string;
  model?: string;
  serialNumber?: string;
  colors?: Array<{
    name: string;
    code: string;
    images: string[];
    stock: number;
  }>;
  sizes?: Array<{
    name: string;
    stock: number;
  }>;
  specifications?: Array<{
    name: string;
    value: string;
  }>;
  materials?: Array<{
    name: string;
    percentage: number;
  }>;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'mm' | 'inch';
  };
  weight?: {
    value: number;
    unit: 'kg' | 'g' | 'lb';
  };
  shipping?: {
    weight: number;
    dimensions: {
      width: number;
      height: number;
      depth: number;
    };
    freeShipping: boolean;
    estimatedDelivery: {
      min: number;
      max: number;
      unit: 'day' | 'week';
    };
  };
  features?: string[];
  tags?: string[];
  images: string[];
  mainImage: string;
  reviews?: Array<{
    user: any;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  questions?: Array<{
    user: any;
    question: string;
    answer?: string;
    answeredBy?: any;
    answeredAt?: Date;
    createdAt: Date;
  }>;
  rating: {
    average: number;
    count: number;
  };
  favorites: number;
  views: number;
  isActive: boolean;
  isDiscounted: boolean;
  discountPercentage?: number;
  installmentOptions?: Array<{
    month: number;
    amount: number;
    bankName: string;
  }>;
  giftOptions?: {
    available: boolean;
    message: string;
    price: number;
  };
  manufacturingDate?: Date;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(filters?: FilterOptions): Observable<Product[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.priceRange) {
        params = params.set('minPrice', filters.priceRange.min.toString());
        params = params.set('maxPrice', filters.priceRange.max.toString());
      }
      
      if (filters.brands.length) {
        params = params.set('brands', filters.brands.join(','));
      }
      
      if (filters.colors.length) {
        params = params.set('colors', filters.colors.join(','));
      }
      
      if (filters.sizes.length) {
        params = params.set('sizes', filters.sizes.join(','));
      }
      
      if (filters.rating > 0) {
        params = params.set('minRating', filters.rating.toString());
      }
      
      if (filters.inStock) {
        params = params.set('inStock', 'true');
      }
      
      if (filters.onSale) {
        params = params.set('onSale', 'true');
      }
      
      if (filters.sortBy) {
        params = params.set('sortBy', filters.sortBy);
      }
    }

    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAvailableBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/brands`);
  }

  getAvailableColors(): Observable<Array<{name: string, code: string}>> {
    return this.http.get<Array<{name: string, code: string}>>(`${this.apiUrl}/colors`);
  }

  getAvailableSizes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/sizes`);
  }

  getPriceRange(): Observable<{min: number, max: number}> {
    return this.http.get<{min: number, max: number}>(`${this.apiUrl}/price-range`);
  }
} 