import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from '../../../services/category.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-management',
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Kategori Yönetimi</h2>
        <button class="btn btn-primary" (click)="showAddForm = !showAddForm">
          {{ showAddForm ? 'İptal' : 'Yeni Kategori Ekle' }}
        </button>
      </div>

      <!-- Kategori Ekleme/Düzenleme Formu -->
      <div class="card mb-4" *ngIf="showAddForm || editingCategory">
        <div class="card-body">
          <h3>{{ editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle' }}</h3>
          <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label class="form-label">Kategori Adı</label>
              <input type="text" class="form-control" formControlName="name">
              <div *ngIf="categoryForm.get('name')?.errors?.['required'] && categoryForm.get('name')?.touched" 
                   class="text-danger">
                Kategori adı zorunludur
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Açıklama</label>
              <textarea class="form-control" formControlName="description" rows="3"></textarea>
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="categoryForm.invalid">
              {{ editingCategory ? 'Güncelle' : 'Ekle' }}
            </button>
            <button type="button" class="btn btn-secondary ms-2" (click)="cancelEdit()">
              İptal
            </button>
          </form>
        </div>
      </div>

      <!-- Kategori Listesi -->
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Açıklama</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let category of categories">
              <td>{{ category.name }}</td>
              <td>{{ category.description }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-2" (click)="editCategory(category)">
                  Düzenle
                </button>
                <button class="btn btn-sm btn-danger" (click)="deleteCategory(category._id)">
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
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule]
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  showAddForm = false;
  editingCategory: Category | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.createCategoryForm();
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  createCategoryForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['']
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
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      
      if (this.editingCategory) {
        this.categoryService.updateCategory(this.editingCategory._id, categoryData).subscribe({
          next: () => {
            this.loadCategories();
            this.cancelEdit();
          },
          error: (error) => {
            console.error('Kategori güncellenirken hata oluştu:', error);
          }
        });
      } else {
        this.categoryService.createCategory(categoryData).subscribe({
          next: () => {
            this.loadCategories();
            this.showAddForm = false;
            this.categoryForm.reset();
          },
          error: (error) => {
            console.error('Kategori eklenirken hata oluştu:', error);
          }
        });
      }
    }
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.showAddForm = false;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
  }

  deleteCategory(id: string): void {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (error) => {
          console.error('Kategori silinirken hata oluştu:', error);
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingCategory = null;
    this.showAddForm = false;
    this.categoryForm.reset();
  }
} 