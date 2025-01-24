import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { Router } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <i class="bi bi-shop me-2"></i>
          E-Ticaret
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/products" routerLinkActive="active">
                <i class="bi bi-grid me-1"></i>
                Ürünler
              </a>
            </li>
            <li class="nav-item" *ngIf="authService.currentUserValue?.role === 'admin'">
              <a class="nav-link" routerLink="/admin" routerLinkActive="active">
                <i class="bi bi-gear me-1"></i>
                Admin Panel
              </a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <ng-container *ngIf="!authService.currentUserValue; else loggedIn">
              <li class="nav-item">
                <a class="nav-link" routerLink="/login" routerLinkActive="active">
                  <i class="bi bi-box-arrow-in-right me-1"></i>
                  Giriş Yap
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/register" routerLinkActive="active">
                  <i class="bi bi-person-plus me-1"></i>
                  Kayıt Ol
                </a>
              </li>
            </ng-container>
            <ng-template #loggedIn>
              <li class="nav-item">
                <a class="nav-link position-relative" routerLink="/cart" routerLinkActive="active">
                  <i class="bi bi-cart3"></i>
                  <span class="cart-badge" 
                        *ngIf="(cartService.cart$ | async)?.items?.length">
                    {{ cartService.itemCount }}
                  </span>
                </a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i class="bi bi-person-circle me-1"></i>
                  {{ authService.currentUserValue?.name }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <a class="dropdown-item" routerLink="/profile">
                      <i class="bi bi-person me-2"></i>
                      Profilim
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" routerLink="/orders">
                      <i class="bi bi-box me-2"></i>
                      Siparişlerim
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <a class="dropdown-item text-danger" (click)="logout()" style="cursor: pointer;">
                      <i class="bi bi-box-arrow-right me-2"></i>
                      Çıkış Yap
                    </a>
                  </li>
                </ul>
              </li>
            </ng-template>
          </ul>
        </div>
      </div>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .navbar {
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,.08);
      padding: 1rem 0;
    }

    .navbar-brand {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2563eb;
    }

    .nav-link {
      color: #4b5563;
      font-weight: 500;
      padding: 0.5rem 1rem;
      transition: all 0.2s ease;
      border-radius: 0.375rem;
      margin: 0 0.25rem;
    }

    .nav-link:hover {
      color: #2563eb;
      background-color: #f3f4f6;
    }

    .nav-link.active {
      color: #2563eb;
      background-color: #eff6ff;
    }

    .cart-badge {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
      background-color: #ef4444;
      color: white;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-weight: 600;
    }

    .dropdown-menu {
      padding: 0.5rem 0;
      border: none;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -1px rgba(0,0,0,.06);
      border-radius: 0.5rem;
    }

    .dropdown-item {
      padding: 0.5rem 1rem;
      color: #4b5563;
      transition: all 0.2s ease;
    }

    .dropdown-item:hover {
      background-color: #f3f4f6;
      color: #2563eb;
    }

    .dropdown-item.text-danger:hover {
      background-color: #fef2f2;
      color: #dc2626;
    }

    main {
      padding: 2rem 0;
    }
  `],
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, AsyncPipe],
  standalone: true
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
