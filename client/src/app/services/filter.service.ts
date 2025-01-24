import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FilterOptions {
  priceRange: {
    min: number;
    max: number;
  };
  brands: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  inStock: boolean;
  onSale: boolean;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular';
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private defaultFilters: FilterOptions = {
    priceRange: { min: 0, max: 10000 },
    brands: [],
    colors: [],
    sizes: [],
    rating: 0,
    inStock: false,
    onSale: false,
    sortBy: 'newest'
  };

  private filtersSubject = new BehaviorSubject<FilterOptions>(this.defaultFilters);
  filters$ = this.filtersSubject.asObservable();

  constructor() {}

  updateFilters(filters: Partial<FilterOptions>): void {
    const currentFilters = this.filtersSubject.value;
    this.filtersSubject.next({
      ...currentFilters,
      ...filters
    });
  }

  resetFilters(): void {
    this.filtersSubject.next(this.defaultFilters);
  }

  getCurrentFilters(): FilterOptions {
    return this.filtersSubject.value;
  }
} 