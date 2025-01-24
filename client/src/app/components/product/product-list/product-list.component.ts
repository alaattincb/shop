import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService, Product } from '../../../services/product.service';
import { CategoryService, Category } from '../../../services/category.service';
import { FilterService } from '../../../services/filter.service';
import { Router } from '@angular/router';
import { NgFor, NgIf, CurrencyPipe, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductFiltersComponent } from '../product-filters/product-filters.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="container-fluid mt-4">
      <div class="row">
        <!-- Filtreler -->
        <div class="col-lg-3 mb-4">
          <app-product-filters></app-product-filters>
        </div>

        <!-- Ürün Listesi -->
        <div class="col-lg-9">
          <div class="row mb-4 align-items-center">
            <div class="col">
              <h2 class="section-title">
                <i class="bi bi-grid me-2"></i>
                Ürünler
                <small class="text-muted ms-2">({{ products.length }} ürün)</small>
              </h2>
            </div>
            <div class="col-auto">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                  <i class="bi bi-funnel"></i>
                </span>
                <select class="form-select border-start-0" [(ngModel)]="selectedCategoryId" (change)="filterByCategory()">
                  <option value="">Tüm Kategoriler</option>
                  <option *ngFor="let category of categories" [value]="category._id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            <div class="col" *ngFor="let product of products">
              <div class="product-card">
                <div class="product-image">
                  <img [src]="product.mainImage" [alt]="product.name">
                  <div class="product-overlay">
                    <button class="btn btn-light btn-sm" (click)="viewProduct(product._id)">
                      <i class="bi bi-eye me-1"></i>
                      İncele
                    </button>
                  </div>
                </div>
                <div class="product-content">
                  <h5 class="product-title">{{ product.name }}</h5>
                  <p class="product-category">{{ product.category.name }}</p>
                  <p class="product-description">{{ product.description | slice:0:100 }}{{ product.description.length > 100 ? '...' : '' }}</p>
                  <div class="d-flex justify-content-between align-items-center mt-3">
                    <div class="product-price">
                      {{ product.price | currency:'TRY':'symbol-narrow':'1.2-2' }}
                    </div>
                    <div class="product-stock" [class.low-stock]="product.stock < 5">
                      <i class="bi" [class.bi-check-circle-fill]="product.stock >= 5" 
                         [class.bi-exclamation-circle-fill]="product.stock < 5"></i>
                      {{ product.stock }} adet
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="products.length === 0" class="text-center my-5">
            <i class="bi bi-inbox display-1 text-muted"></i>
            <h3 class="mt-3">Ürün bulunamadı</h3>
            <p class="text-muted">Lütfen filtrelerinizi değiştirin veya daha sonra tekrar deneyin.</p>
            <button class="btn btn-primary" (click)="resetFilters()">
              Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .section-title {
      color: #1f2937;
      font-weight: 600;
    }

    .product-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -1px rgba(0,0,0,.06);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05);
    }

    .product-image {
      position: relative;
      padding-top: 75%;
      overflow: hidden;
    }

    .product-image img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image img {
      transform: scale(1.1);
    }

    .product-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .product-card:hover .product-overlay {
      opacity: 1;
    }

    .product-content {
      padding: 1.5rem;
    }

    .product-title {
      color: #1f2937;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .product-category {
      color: #6b7280;
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
    }

    .product-description {
      color: #4b5563;
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: 0;
    }

    .product-price {
      color: #2563eb;
      font-weight: 600;
      font-size: 1.25rem;
    }

    .product-stock {
      font-size: 0.875rem;
      color: #10b981;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .product-stock.low-stock {
      color: #ef4444;
    }

    .input-group-text {
      color: #6b7280;
    }

    .form-select {
      border-color: #e5e7eb;
      color: #4b5563;
    }

    .form-select:focus {
      border-color: #93c5fd;
      box-shadow: 0 0 0 0.25rem rgba(37,99,235,.1);
    }
  `],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    CurrencyPipe,
    SlicePipe,
    ProductFiltersComponent
  ]
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: string = '';
  private filterSubscription: Subscription;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private filterService: FilterService,
    private router: Router
  ) {
    this.filterSubscription = this.filterService.filters$.subscribe(filters => {
      this.loadProducts(filters);
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
      }
    });
  }

  loadProducts(filters: any): void {
    this.productService.getProducts(filters).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Ürünler yüklenirken hata oluştu:', error);
      }
    });
  }

  filterByCategory(): void {
    if (this.selectedCategoryId) {
      this.productService.getProductsByCategory(this.selectedCategoryId).subscribe({
        next: (products) => {
          this.products = products;
        },
        error: (error) => {
          console.error('Kategori filtreleme hatası:', error);
        }
      });
    } else {
      this.loadProducts(this.filterService.getCurrentFilters());
    }
  }

  viewProduct(id: string): void {
    this.router.navigate(['/products', id]);
  }

  resetFilters(): void {
    this.filterService.resetFilters();
    this.selectedCategoryId = '';
  }
} 