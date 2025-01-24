import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoriteService, Favorite } from '../../services/favorite.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col">
          <h2 class="section-title mb-4">
            <i class="bi bi-heart-fill me-2"></i>
            Favori Ürünlerim
          </h2>

          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4" *ngIf="favorites.length > 0">
            <div class="col" *ngFor="let favorite of favorites">
              <div class="favorite-card">
                <div class="favorite-image">
                  <img [src]="favorite.product.mainImage" [alt]="favorite.product.name">
                  <div class="favorite-overlay">
                    <button class="btn btn-light btn-sm me-2" [routerLink]="['/products', favorite.product._id]">
                      <i class="bi bi-eye me-1"></i>
                      İncele
                    </button>
                    <button class="btn btn-danger btn-sm" (click)="removeFromFavorites(favorite.product._id)">
                      <i class="bi bi-heart-fill me-1"></i>
                      Kaldır
                    </button>
                  </div>
                </div>
                <div class="favorite-content">
                  <h5 class="favorite-title">{{ favorite.product.name }}</h5>
                  <p class="favorite-category">{{ favorite.product.category.name }}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="favorite-price">
                      {{ favorite.product.price | currency:'TRY':'symbol-narrow':'1.2-2' }}
                    </div>
                    <small class="text-muted">
                      {{ favorite.addedAt | date:'dd.MM.yyyy' }}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="favorites.length === 0" class="text-center my-5">
            <i class="bi bi-heart display-1 text-muted"></i>
            <h3 class="mt-3">Henüz favori ürününüz yok</h3>
            <p class="text-muted">Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca ulaşabilirsiniz.</p>
            <button class="btn btn-primary" routerLink="/products">
              Ürünleri İncele
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

    .favorite-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -1px rgba(0,0,0,.06);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .favorite-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05);
    }

    .favorite-image {
      position: relative;
      padding-top: 75%;
      overflow: hidden;
    }

    .favorite-image img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .favorite-card:hover .favorite-image img {
      transform: scale(1.1);
    }

    .favorite-overlay {
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

    .favorite-card:hover .favorite-overlay {
      opacity: 1;
    }

    .favorite-content {
      padding: 1.5rem;
    }

    .favorite-title {
      color: #1f2937;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .favorite-category {
      color: #6b7280;
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
    }

    .favorite-price {
      color: #2563eb;
      font-weight: 600;
      font-size: 1.25rem;
    }
  `]
})
export class FavoriteListComponent implements OnInit {
  favorites: Favorite[] = [];

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteService.getFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
      },
      error: (error) => {
        console.error('Favoriler yüklenirken hata oluştu:', error);
      }
    });
  }

  removeFromFavorites(productId: string): void {
    this.favoriteService.removeFromFavorites(productId).subscribe({
      error: (error) => {
        console.error('Favori kaldırılırken hata oluştu:', error);
      }
    });
  }
} 