import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
          <div class="position-sticky pt-3">
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/products" routerLinkActive="active">
                  Ürün Yönetimi
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/categories" routerLinkActive="active">
                  Kategori Yönetimi
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/orders" routerLinkActive="active">
                  Sipariş Yönetimi
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <!-- Main content -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      height: calc(100vh - 56px);
      border-right: 1px solid #dee2e6;
    }
    .nav-link {
      color: #333;
      padding: 0.5rem 1rem;
    }
    .nav-link:hover {
      background-color: #f8f9fa;
    }
    .nav-link.active {
      color: #0d6efd;
      font-weight: bold;
    }
  `],
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive]
})
export class AdminLayoutComponent {} 