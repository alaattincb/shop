import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { NgIf, NgFor, CommonModule, DatePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetaService } from '../../../services/meta.service';

@Component({
  selector: 'app-product-detail',
  template: `
    <div class="container mt-4" *ngIf="product">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a routerLink="/products">
              <i class="bi bi-grid me-1"></i>
              Ürünler
            </a>
          </li>
          <li class="breadcrumb-item">
            <a [routerLink]="['/products']" [queryParams]="{category: product.category._id}">
              {{ product.category?.name }}
            </a>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ product.name }}</li>
        </ol>
      </nav>

      <div class="product-detail-card">
        <div class="row g-0">
          <div class="col-md-6">
            <div class="product-image">
              <img [src]="product.mainImage" [alt]="product.name" class="img-fluid">
              <div class="product-badges">
                <span class="badge stock-badge" [class.stock-low]="product.stock < 5" [class.stock-available]="product.stock >= 5">
                  <i class="bi" [class.bi-check-circle-fill]="product.stock >= 5" 
                     [class.bi-exclamation-circle-fill]="product.stock < 5"></i>
                  {{ product.stock }} adet
                </span>
                <span class="badge discount-badge" *ngIf="product.isDiscounted">
                  <i class="bi bi-tag-fill me-1"></i>
                  %{{ product.discountPercentage }} İndirim
                </span>
              </div>
              <div class="product-thumbnails" *ngIf="product.images && product.images.length > 1">
                <div class="thumbnail" *ngFor="let image of product.images" 
                     [class.active]="selectedImage === image"
                     (click)="selectImage(image)">
                  <img [src]="image" [alt]="product.name">
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="product-info">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 class="product-title">{{ product.name }}</h1>
                  <p class="product-brand">
                    <i class="bi bi-award me-2"></i>
                    {{ product.brand }}
                    <span *ngIf="product.model">({{ product.model }})</span>
                  </p>
                </div>
                <button class="btn btn-outline-danger favorite-btn" 
                        (click)="toggleFavorite()"
                        [class.active]="isFavorite">
                  <i class="bi" [class.bi-heart]="!isFavorite" [class.bi-heart-fill]="isFavorite"></i>
                </button>
              </div>

              <div class="product-rating mb-3" *ngIf="product.rating.count > 0">
                <div class="stars">
                  <i class="bi" *ngFor="let star of [1,2,3,4,5]"
                     [class.bi-star-fill]="star <= product.rating.average"
                     [class.bi-star]="star > product.rating.average"></i>
                </div>
                <span class="rating-text">
                  {{ product.rating.average | number:'1.1-1' }} / 5
                  ({{ product.rating.count }} değerlendirme)
                </span>
              </div>

              <div class="product-price-section mb-4">
                <div class="current-price">
                  {{ product.price | currency:'TRY':'symbol-narrow':'1.2-2' }}
                </div>
                <div class="old-price" *ngIf="product.oldPrice">
                  <span class="strikethrough">
                    {{ product.oldPrice | currency:'TRY':'symbol-narrow':'1.2-2' }}
                  </span>
                  <span class="discount-label">
                    %{{ product.discountPercentage }} indirim
                  </span>
                </div>
              </div>

              <div class="product-variants mb-4" *ngIf="product.colors?.length || product.sizes?.length">
                <div class="color-options mb-3" *ngIf="product.colors?.length">
                  <label class="variant-label">Renk:</label>
                  <div class="color-list">
                    <div class="color-item" *ngFor="let color of product.colors"
                         [class.active]="selectedColor === color"
                         (click)="selectColor(color)"
                         [style.background-color]="color.code"
                         [class.disabled]="color.stock === 0">
                      <span class="color-name">{{ color.name }}</span>
                    </div>
                  </div>
                </div>

                <div class="size-options" *ngIf="product.sizes?.length">
                  <label class="variant-label">Beden:</label>
                  <div class="size-list">
                    <div class="size-item" *ngFor="let size of product.sizes"
                         [class.active]="selectedSize === size"
                         (click)="selectSize(size)"
                         [class.disabled]="size.stock === 0">
                      {{ size.name }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="product-actions mb-4" *ngIf="authService.currentUserValue">
                <div class="quantity-control">
                  <button class="btn btn-outline-secondary" 
                          (click)="quantity = quantity - 1"
                          [disabled]="quantity <= 1">
                    <i class="bi bi-dash"></i>
                  </button>
                  <input type="number" class="form-control" 
                         [(ngModel)]="quantity"
                         min="1"
                         [max]="getAvailableStock()">
                  <button class="btn btn-outline-secondary" 
                          (click)="quantity = quantity + 1"
                          [disabled]="quantity >= getAvailableStock()">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
                <button class="btn btn-primary add-to-cart" 
                        (click)="addToCart()"
                        [disabled]="!canAddToCart()">
                  <i class="bi bi-cart-plus me-2"></i>
                  Sepete Ekle
                </button>
              </div>

              <div class="shipping-info mb-4" *ngIf="product.shipping">
                <div class="info-item" *ngIf="product.shipping.freeShipping">
                  <i class="bi bi-truck me-2"></i>
                  <span class="text-success">Ücretsiz Kargo</span>
                </div>
                <div class="info-item" *ngIf="product.shipping.estimatedDelivery">
                  <i class="bi bi-calendar-check me-2"></i>
                  Tahmini Teslimat: 
                  {{ product.shipping.estimatedDelivery.min }}-{{ product.shipping.estimatedDelivery.max }}
                  {{ product.shipping.estimatedDelivery.unit === 'day' ? 'gün' : 'hafta' }}
                </div>
              </div>

              <div class="product-specs">
                <h3 class="specs-title">Ürün Özellikleri</h3>
                <div class="specs-grid">
                  <div class="spec-item" *ngIf="product.specifications?.length">
                    <div class="spec-row" *ngFor="let spec of product.specifications">
                      <span class="spec-name">{{ spec.name }}</span>
                      <span class="spec-value">{{ spec.value }}</span>
                    </div>
                  </div>
                  <div class="spec-item" *ngIf="product.materials?.length">
                    <h4>Malzeme Bilgisi</h4>
                    <div class="material-list">
                      <div class="material-item" *ngFor="let material of product.materials">
                        {{ material.name }} (%{{ material.percentage }})
                      </div>
                    </div>
                  </div>
                  <div class="spec-item" *ngIf="product.dimensions">
                    <h4>Ürün Boyutları</h4>
                    <div class="dimensions">
                      {{ product.dimensions.width }} x 
                      {{ product.dimensions.height }} x 
                      {{ product.dimensions.depth }} 
                      {{ product.dimensions.unit }}
                    </div>
                  </div>
                  <div class="spec-item" *ngIf="product.weight">
                    <h4>Ağırlık</h4>
                    <div>
                      {{ product.weight.value }} {{ product.weight.unit }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="product-description mt-4">
                <h3 class="description-title">Ürün Açıklaması</h3>
                <p>{{ product.description }}</p>
              </div>

              <div class="admin-actions mt-4" *ngIf="isAdmin">
                <button class="btn btn-outline-primary me-2" (click)="editProduct()">
                  <i class="bi bi-pencil me-1"></i>
                  Düzenle
                </button>
                <button class="btn btn-outline-danger" (click)="deleteProduct()">
                  <i class="bi bi-trash me-1"></i>
                  Sil
                </button>
              </div>

              <div class="social-share mb-4">
                <h6 class="share-title">Bu ürünü paylaş:</h6>
                <div class="share-buttons">
                  <button class="btn btn-facebook" (click)="shareOnFacebook()">
                    <i class="bi bi-facebook"></i>
                  </button>
                  <button class="btn btn-twitter" (click)="shareOnTwitter()">
                    <i class="bi bi-twitter"></i>
                  </button>
                  <button class="btn btn-whatsapp" (click)="shareOnWhatsApp()">
                    <i class="bi bi-whatsapp"></i>
                  </button>
                  <button class="btn btn-telegram" (click)="shareOnTelegram()">
                    <i class="bi bi-telegram"></i>
                  </button>
                  <button class="btn btn-copy" (click)="copyLink()">
                    <i class="bi bi-link-45deg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Yorumlar ve Değerlendirmeler -->
      <div class="reviews-section mt-5" *ngIf="product.reviews?.length">
        <h3 class="section-title">Değerlendirmeler</h3>
        <div class="review-list">
          <div class="review-item" *ngFor="let review of product.reviews">
            <div class="review-header">
              <div class="review-rating">
                <i class="bi" *ngFor="let star of [1,2,3,4,5]"
                   [class.bi-star-fill]="star <= review.rating"
                   [class.bi-star]="star > review.rating"></i>
              </div>
              <div class="review-meta">
                <span class="review-author">{{ review.user.name }}</span>
                <span class="review-date">{{ review.createdAt | date }}</span>
              </div>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
          </div>
        </div>
      </div>

      <!-- Soru-Cevap Bölümü -->
      <div class="questions-section mt-5" *ngIf="product.questions?.length">
        <h3 class="section-title">Soru & Cevap</h3>
        <div class="question-list">
          <div class="question-item" *ngFor="let qa of product.questions">
            <div class="question">
              <i class="bi bi-question-circle me-2"></i>
              <div class="question-content">
                <div class="question-meta">
                  <span class="question-author">{{ qa.user.name }}</span>
                  <span class="question-date">{{ qa.createdAt | date }}</span>
                </div>
                <p class="question-text">{{ qa.question }}</p>
              </div>
            </div>
            <div class="answer" *ngIf="qa.answer">
              <i class="bi bi-chat-left-text me-2"></i>
              <div class="answer-content">
                <div class="answer-meta">
                  <span class="answer-author">{{ qa.answeredBy.name }}</span>
                  <span class="answer-date">{{ qa.answeredAt | date }}</span>
                </div>
                <p class="answer-text">{{ qa.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .breadcrumb {
      background: white;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .breadcrumb-item a {
      color: #4b5563;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .breadcrumb-item a:hover {
      color: #2563eb;
    }

    .product-detail-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -1px rgba(0,0,0,.06);
    }

    .product-image {
      position: relative;
      height: 100%;
      min-height: 400px;
      background: #f3f4f6;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-badges {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .badge {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stock-available {
      background-color: #ecfdf5;
      color: #059669;
    }

    .stock-low {
      background-color: #fef2f2;
      color: #dc2626;
    }

    .product-info {
      padding: 2rem;
    }

    .product-title {
      color: #1f2937;
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .product-brand {
      color: #6b7280;
      font-size: 1rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
    }

    .favorite-btn {
      padding: 0.5rem;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .favorite-btn.active {
      background-color: #fecdd3;
      border-color: #fecdd3;
      color: #e11d48;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stars {
      color: #fbbf24;
    }

    .rating-text {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .product-price-section {
      display: flex;
      align-items: baseline;
      gap: 1rem;
    }

    .current-price {
      color: #2563eb;
      font-size: 2rem;
      font-weight: 600;
    }

    .old-price {
      display: flex;
      flex-direction: column;
    }

    .strikethrough {
      color: #9ca3af;
      text-decoration: line-through;
      font-size: 1.25rem;
    }

    .discount-label {
      color: #dc2626;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .variant-label {
      display: block;
      color: #4b5563;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .color-list {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .color-item {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #e5e7eb;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;
    }

    .color-item.active {
      border-color: #2563eb;
      transform: scale(1.1);
    }

    .color-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .color-name {
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.75rem;
      white-space: nowrap;
      color: #4b5563;
    }

    .size-list {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .size-item {
      padding: 0.5rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .size-item.active {
      background-color: #2563eb;
      color: white;
      border-color: #2563eb;
    }

    .size-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .shipping-info {
      padding: 1rem;
      background-color: #f3f4f6;
      border-radius: 0.5rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      color: #4b5563;
    }

    .info-item:last-child {
      margin-bottom: 0;
    }

    .specs-title, .description-title, .section-title {
      color: #1f2937;
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .specs-grid {
      display: grid;
      gap: 1.5rem;
      padding: 1.5rem;
      background-color: #f9fafb;
      border-radius: 0.5rem;
    }

    .spec-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .spec-row:last-child {
      border-bottom: none;
    }

    .spec-name {
      color: #6b7280;
      font-weight: 500;
    }

    .spec-value {
      color: #1f2937;
    }

    .material-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .material-item {
      padding: 0.25rem 0.75rem;
      background-color: #e5e7eb;
      border-radius: 9999px;
      font-size: 0.875rem;
      color: #4b5563;
    }

    .review-list, .question-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .review-item, .question-item {
      padding: 1.5rem;
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .review-header, .question-meta, .answer-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .review-author, .question-author, .answer-author {
      font-weight: 500;
      color: #1f2937;
    }

    .review-date, .question-date, .answer-date {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .review-comment, .question-text, .answer-text {
      color: #4b5563;
      line-height: 1.5;
      margin: 0;
    }

    .question, .answer {
      display: flex;
      gap: 1rem;
    }

    .answer {
      margin-top: 1rem;
      margin-left: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .product-thumbnails {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      padding: 0.5rem;
      background-color: white;
      border-radius: 0.5rem;
      overflow-x: auto;
    }

    .thumbnail {
      width: 60px;
      height: 60px;
      border-radius: 0.375rem;
      overflow: hidden;
      cursor: pointer;
      opacity: 0.6;
      transition: all 0.2s ease;
    }

    .thumbnail.active {
      opacity: 1;
      border: 2px solid #2563eb;
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .social-share {
      padding: 1rem;
      background-color: #f9fafb;
      border-radius: 0.5rem;
    }

    .share-title {
      color: #4b5563;
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
    }

    .share-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .share-buttons .btn {
      width: 40px;
      height: 40px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .btn-facebook {
      background-color: #1877f2;
      color: white;
    }

    .btn-twitter {
      background-color: #1da1f2;
      color: white;
    }

    .btn-whatsapp {
      background-color: #25d366;
      color: white;
    }

    .btn-telegram {
      background-color: #0088cc;
      color: white;
    }

    .btn-copy {
      background-color: #6b7280;
      color: white;
    }

    .share-buttons .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
    }

    .share-buttons .btn i {
      font-size: 1.25rem;
    }

    @media (max-width: 768px) {
      .product-image {
        min-height: 300px;
      }

      .product-actions {
        flex-direction: column;
      }

      .quantity-control {
        width: 100%;
      }

      .specs-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    RouterLink
  ]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  isAdmin: boolean = false;
  quantity: number = 1;
  selectedImage: string = '';
  selectedColor: any = null;
  selectedSize: any = null;
  isFavorite: boolean = false;
  shareUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    public authService: AuthService,
    private cartService: CartService,
    private metaService: MetaService
  ) {
    this.isAdmin = this.authService.currentUserValue?.role === 'admin';
    this.shareUrl = window.location.href;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedImage = product.mainImage;
        this.metaService.updateProductMeta(product);
      },
      error: (error) => {
        console.error('Ürün yüklenirken hata oluştu:', error);
        this.router.navigate(['/products']);
      }
    });
  }

  ngOnDestroy(): void {
    this.metaService.resetMeta();
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  selectColor(color: any): void {
    if (color.stock > 0) {
      this.selectedColor = color;
      this.quantity = 1;
    }
  }

  selectSize(size: any): void {
    if (size.stock > 0) {
      this.selectedSize = size;
      this.quantity = 1;
    }
  }

  getAvailableStock(): number {
    if (this.selectedColor) {
      return this.selectedColor.stock;
    }
    if (this.selectedSize) {
      return this.selectedSize.stock;
    }
    return this.product?.stock || 0;
  }

  canAddToCart(): boolean {
    const hasStock = this.getAvailableStock() > 0;
    const hasRequiredSelections = 
      (!this.product?.colors?.length || this.selectedColor) &&
      (!this.product?.sizes?.length || this.selectedSize);
    return hasStock && hasRequiredSelections;
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    // TODO: Implement favorite functionality
  }

  addToCart(): void {
    if (this.product && this.quantity > 0 && this.canAddToCart()) {
      this.cartService.addToCart(this.product._id, this.quantity).subscribe({
        next: () => {
          alert('Ürün sepete eklendi');
        },
        error: (error) => {
          console.error('Ürün sepete eklenirken hata oluştu:', error);
          alert('Ürün sepete eklenirken bir hata oluştu');
        }
      });
    }
  }

  editProduct(): void {
    if (this.product) {
      this.router.navigate(['/admin/products/edit', this.product._id]);
    }
  }

  deleteProduct(): void {
    if (this.product && confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      this.productService.deleteProduct(this.product._id).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Ürün silinirken hata oluştu:', error);
        }
      });
    }
  }

  shareOnFacebook(): void {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.shareUrl)}`;
    window.open(url, '_blank');
  }

  shareOnTwitter(): void {
    const text = this.product ? `${this.product.name} - ${this.product.description.substring(0, 100)}...` : '';
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(this.shareUrl)}`;
    window.open(url, '_blank');
  }

  shareOnWhatsApp(): void {
    const text = this.product ? `${this.product.name} - ${this.shareUrl}` : '';
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  shareOnTelegram(): void {
    const text = this.product ? `${this.product.name} - ${this.shareUrl}` : '';
    const url = `https://t.me/share/url?url=${encodeURIComponent(this.shareUrl)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.shareUrl).then(() => {
      alert('Bağlantı kopyalandı!');
    });
  }
} 