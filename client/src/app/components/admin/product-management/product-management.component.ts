import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../../services/product.service';
import { CategoryService, Category } from '../../../services/category.service';
import { Router } from '@angular/router';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-management',
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Ürün Yönetimi</h2>
        <button class="btn btn-primary" (click)="showAddForm = !showAddForm">
          {{ showAddForm ? 'İptal' : 'Yeni Ürün Ekle' }}
        </button>
      </div>

      <!-- Ürün Ekleme/Düzenleme Formu -->
      <div class="card mb-4" *ngIf="showAddForm || editingProduct">
        <div class="card-body">
          <h3>{{ editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle' }}</h3>
          <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label class="form-label">Ürün Adı</label>
              <input type="text" class="form-control" formControlName="name">
              <div *ngIf="productForm.get('name')?.errors?.['required'] && productForm.get('name')?.touched" 
                   class="text-danger">
                Ürün adı zorunludur
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Açıklama</label>
              <textarea class="form-control" formControlName="description" rows="3"></textarea>
              <div *ngIf="productForm.get('description')?.errors?.['required'] && productForm.get('description')?.touched" 
                   class="text-danger">
                Açıklama zorunludur
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Fiyat</label>
              <input type="number" class="form-control" formControlName="price">
              <div *ngIf="productForm.get('price')?.errors?.['required'] && productForm.get('price')?.touched" 
                   class="text-danger">
                Fiyat zorunludur
              </div>
              <div *ngIf="productForm.get('price')?.errors?.['min'] && productForm.get('price')?.touched" 
                   class="text-danger">
                Fiyat 0'dan büyük olmalıdır
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Stok</label>
              <input type="number" class="form-control" formControlName="stock">
              <div *ngIf="productForm.get('stock')?.errors?.['required'] && productForm.get('stock')?.touched" 
                   class="text-danger">
                Stok zorunludur
              </div>
              <div *ngIf="productForm.get('stock')?.errors?.['min'] && productForm.get('stock')?.touched" 
                   class="text-danger">
                Stok 0'dan küçük olamaz
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Kategori</label>
              <select class="form-select" formControlName="category">
                <option value="">Kategori Seçin</option>
                <option *ngFor="let category of categories" [value]="category._id">
                  {{ category.name }}
                </option>
              </select>
              <div *ngIf="productForm.get('category')?.errors?.['required'] && productForm.get('category')?.touched" 
                   class="text-danger">
                Kategori zorunludur
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Resim URL</label>
              <input type="text" class="form-control" formControlName="mainImage">
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="productForm.invalid">
              {{ editingProduct ? 'Güncelle' : 'Ekle' }}
            </button>
            <button type="button" class="btn btn-secondary ms-2" (click)="cancelEdit()">
              İptal
            </button>
          </form>
        </div>
      </div>

      <!-- Ürün Listesi -->
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Resim</th>
              <th>Ad</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td>
                <img [src]="product.mainImage" [alt]="product.name" style="height: 50px; width: 50px; object-fit: cover;">
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.category?.name }}</td>
              <td>{{ product.price | currency:'TRY':'symbol-narrow':'1.2-2' }}</td>
              <td [class.text-danger]="product.stock < 5">{{ product.stock }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-2" (click)="editProduct(product)">
                  Düzenle
                </button>
                <button class="btn btn-sm btn-danger" (click)="deleteProduct(product._id)">
                  Sil
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule, CurrencyPipe]
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;
  showAddForm = false;
  editingProduct: Product | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.productForm = this.createProductForm();
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  createProductForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      mainImage: ['']
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Ürünler yüklenirken hata oluştu:', error);
      }
    });
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

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      
      if (this.editingProduct) {
        this.productService.updateProduct(this.editingProduct._id, productData).subscribe({
          next: () => {
            this.loadProducts();
            this.cancelEdit();
          },
          error: (error) => {
            console.error('Ürün güncellenirken hata oluştu:', error);
          }
        });
      } else {
        this.productService.createProduct(productData).subscribe({
          next: () => {
            this.loadProducts();
            this.showAddForm = false;
            this.productForm.reset();
          },
          error: (error) => {
            console.error('Ürün eklenirken hata oluştu:', error);
          }
        });
      }
    }
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.showAddForm = false;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category._id,
      mainImage: product.mainImage,
      images: product.images
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Ürün silinirken hata oluştu:', error);
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingProduct = null;
    this.showAddForm = false;
    this.productForm.reset();
  }
} 