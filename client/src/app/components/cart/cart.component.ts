import { Component, OnInit } from '@angular/core';
import { CartService, Cart, CartItem } from '../../services/cart.service';
import { Router } from '@angular/router';
import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  template: `
    <div class="container mt-4">
      <h2>Sepetim</h2>

      <div *ngIf="cart$ | async as cart">
        <div *ngIf="cart.items.length > 0; else emptyCart">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Fiyat</th>
                  <th>Miktar</th>
                  <th>Toplam</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of cart.items">
                  <td>
                    <div class="d-flex align-items-center">
                      <img [src]="item.product.mainImage" 
                           [alt]="item.product.name" 
                           class="cart-item-image me-3">
                      <div>
                        <h6 class="mb-0">{{ item.product.name }}</h6>
                      </div>
                    </div>
                  </td>
                  <td>{{ item.price | currency:'TRY':'symbol-narrow':'1.2-2' }}</td>
                  <td>
                    <div class="input-group" style="width: 120px;">
                      <button class="btn btn-outline-secondary" 
                              (click)="updateQuantity(item, item.quantity - 1)"
                              [disabled]="item.quantity <= 1">
                        -
                      </button>
                      <input type="number" class="form-control text-center" 
                             [(ngModel)]="item.quantity"
                             (change)="updateQuantity(item, item.quantity)">
                      <button class="btn btn-outline-secondary" 
                              (click)="updateQuantity(item, item.quantity + 1)">
                        +
                      </button>
                    </div>
                  </td>
                  <td>{{ item.price * item.quantity | currency:'TRY':'symbol-narrow':'1.2-2' }}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" 
                            (click)="removeFromCart(item.product._id)">
                      Kaldır
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-end"><strong>Toplam:</strong></td>
                  <td colspan="2">
                    <strong>{{ cart.totalAmount | currency:'TRY':'symbol-narrow':'1.2-2' }}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="d-flex justify-content-between mt-4">
            <button class="btn btn-outline-danger" (click)="clearCart()">
              Sepeti Temizle
            </button>
            <button class="btn btn-primary" (click)="checkout()">
              Alışverişi Tamamla
            </button>
          </div>
        </div>
      </div>

      <ng-template #emptyCart>
        <div class="text-center my-5">
          <h4>Sepetiniz boş</h4>
          <p>Alışverişe başlamak için ürünleri inceleyebilirsiniz.</p>
          <button class="btn btn-primary" (click)="goToProducts()">
            Ürünleri İncele
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .cart-item-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }
    .input-group input {
      text-align: center;
    }
    .input-group input::-webkit-outer-spin-button,
    .input-group input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .input-group input[type=number] {
      -moz-appearance: textfield;
    }
  `],
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CurrencyPipe, AsyncPipe]
})
export class CartComponent implements OnInit {
  cart$: Observable<Cart | null>;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {}

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) return;
    
    this.cartService.updateCartItem(item.product._id, quantity).subscribe({
      error: (error) => {
        console.error('Miktar güncellenirken hata oluştu:', error);
        // Hata durumunda eski miktarı geri yükle
        item.quantity = item.quantity;
      }
    });
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      error: (error) => console.error('Ürün sepetten çıkarılırken hata oluştu:', error)
    });
  }

  clearCart(): void {
    if (confirm('Sepeti temizlemek istediğinizden emin misiniz?')) {
      this.cartService.clearCart().subscribe({
        error: (error) => console.error('Sepet temizlenirken hata oluştu:', error)
      });
    }
  }

  checkout(): void {
    // Ödeme sayfasına yönlendir
    this.router.navigate(['/checkout']);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
} 