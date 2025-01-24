import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterService, FilterOptions } from '../../../services/filter.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters-container">
      <div class="filter-section">
        <h5 class="filter-title">Fiyat Aralığı</h5>
        <div class="price-range">
          <input type="number" class="form-control" [(ngModel)]="filters.priceRange.min" 
                 (change)="updateFilters()" placeholder="Min">
          <span>-</span>
          <input type="number" class="form-control" [(ngModel)]="filters.priceRange.max" 
                 (change)="updateFilters()" placeholder="Max">
        </div>
      </div>

      <div class="filter-section">
        <h5 class="filter-title">Markalar</h5>
        <div class="brand-list">
          <div class="form-check" *ngFor="let brand of availableBrands">
            <input class="form-check-input" type="checkbox" 
                   [id]="'brand-' + brand"
                   [checked]="filters.brands.includes(brand)"
                   (change)="toggleBrand(brand)">
            <label class="form-check-label" [for]="'brand-' + brand">
              {{ brand }}
            </label>
          </div>
        </div>
      </div>

      <div class="filter-section">
        <h5 class="filter-title">Renkler</h5>
        <div class="color-list">
          <div class="color-item" *ngFor="let color of availableColors"
               [style.background-color]="color.code"
               [class.active]="filters.colors.includes(color.name)"
               (click)="toggleColor(color.name)"
               [title]="color.name">
          </div>
        </div>
      </div>

      <div class="filter-section">
        <h5 class="filter-title">Bedenler</h5>
        <div class="size-list">
          <button class="btn btn-outline-secondary size-btn"
                  *ngFor="let size of availableSizes"
                  [class.active]="filters.sizes.includes(size)"
                  (click)="toggleSize(size)">
            {{ size }}
          </button>
        </div>
      </div>

      <div class="filter-section">
        <h5 class="filter-title">Değerlendirme</h5>
        <div class="rating-filter">
          <div class="form-check" *ngFor="let rating of [4,3,2,1]">
            <input class="form-check-input" type="radio" 
                   name="rating" [id]="'rating-' + rating"
                   [checked]="filters.rating === rating"
                   (change)="setRating(rating)">
            <label class="form-check-label" [for]="'rating-' + rating">
              <i class="bi bi-star-fill" *ngFor="let star of [].constructor(rating)"></i>
              <i class="bi bi-star" *ngFor="let star of [].constructor(5-rating)"></i>
              ve üzeri
            </label>
          </div>
        </div>
      </div>

      <div class="filter-section">
        <h5 class="filter-title">Diğer Filtreler</h5>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" 
                 id="inStock" [(ngModel)]="filters.inStock"
                 (change)="updateFilters()">
          <label class="form-check-label" for="inStock">
            Sadece Stokta Olanlar
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" 
                 id="onSale" [(ngModel)]="filters.onSale"
                 (change)="updateFilters()">
          <label class="form-check-label" for="onSale">
            İndirimdekiler
          </label>
        </div>
      </div>

      <div class="filter-section">
        <h5 class="filter-title">Sıralama</h5>
        <select class="form-select" [(ngModel)]="filters.sortBy" (change)="updateFilters()">
          <option value="newest">En Yeniler</option>
          <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
          <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
          <option value="rating">Değerlendirme</option>
          <option value="popular">Popülerlik</option>
        </select>
      </div>

      <button class="btn btn-primary w-100 mt-3" (click)="resetFilters()">
        Filtreleri Temizle
      </button>
    </div>
  `,
  styles: [`
    .filters-container {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .filter-section {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .filter-section:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .filter-title {
      color: #1f2937;
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .price-range {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .price-range input {
      width: 100%;
    }

    .brand-list {
      max-height: 200px;
      overflow-y: auto;
    }

    .color-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .color-item {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #e5e7eb;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .color-item.active {
      transform: scale(1.1);
      border-color: #2563eb;
    }

    .size-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .size-btn {
      min-width: 40px;
      height: 40px;
      padding: 0.5rem;
      border-radius: 0.375rem;
    }

    .size-btn.active {
      background-color: #2563eb;
      color: white;
      border-color: #2563eb;
    }

    .rating-filter .bi-star-fill {
      color: #fbbf24;
    }

    .rating-filter .bi-star {
      color: #d1d5db;
    }

    .form-check {
      margin-bottom: 0.5rem;
    }

    .form-check:last-child {
      margin-bottom: 0;
    }

    ::-webkit-scrollbar {
      width: 6px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `]
})
export class ProductFiltersComponent implements OnInit {
  filters: FilterOptions;
  availableBrands: string[] = [];
  availableColors: Array<{name: string, code: string}> = [];
  availableSizes: string[] = [];

  constructor(
    private filterService: FilterService,
    private productService: ProductService
  ) {
    this.filters = this.filterService.getCurrentFilters();
  }

  ngOnInit(): void {
    this.loadFilterOptions();
  }

  loadFilterOptions(): void {
    this.productService.getAvailableBrands().subscribe(brands => {
      this.availableBrands = brands;
    });

    this.productService.getAvailableColors().subscribe(colors => {
      this.availableColors = colors;
    });

    this.productService.getAvailableSizes().subscribe(sizes => {
      this.availableSizes = sizes;
    });

    this.productService.getPriceRange().subscribe(range => {
      this.filters.priceRange = range;
      this.updateFilters();
    });
  }

  updateFilters(): void {
    this.filterService.updateFilters(this.filters);
  }

  toggleBrand(brand: string): void {
    const index = this.filters.brands.indexOf(brand);
    if (index === -1) {
      this.filters.brands.push(brand);
    } else {
      this.filters.brands.splice(index, 1);
    }
    this.updateFilters();
  }

  toggleColor(color: string): void {
    const index = this.filters.colors.indexOf(color);
    if (index === -1) {
      this.filters.colors.push(color);
    } else {
      this.filters.colors.splice(index, 1);
    }
    this.updateFilters();
  }

  toggleSize(size: string): void {
    const index = this.filters.sizes.indexOf(size);
    if (index === -1) {
      this.filters.sizes.push(size);
    } else {
      this.filters.sizes.splice(index, 1);
    }
    this.updateFilters();
  }

  setRating(rating: number): void {
    this.filters.rating = rating;
    this.updateFilters();
  }

  resetFilters(): void {
    this.filterService.resetFilters();
    this.filters = this.filterService.getCurrentFilters();
  }
} 