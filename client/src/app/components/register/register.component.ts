import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="text-center mb-4">Kayıt Ol</h2>
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">Ad Soyad</label>
                  <input type="text" class="form-control" formControlName="name">
                  <div *ngIf="registerForm.get('name')?.errors?.['required'] && registerForm.get('name')?.touched" 
                       class="text-danger">
                    Ad Soyad zorunludur
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" formControlName="email">
                  <div *ngIf="registerForm.get('email')?.errors?.['required'] && registerForm.get('email')?.touched" 
                       class="text-danger">
                    Email zorunludur
                  </div>
                  <div *ngIf="registerForm.get('email')?.errors?.['email'] && registerForm.get('email')?.touched" 
                       class="text-danger">
                    Geçerli bir email adresi giriniz
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Şifre</label>
                  <input type="password" class="form-control" formControlName="password">
                  <div *ngIf="registerForm.get('password')?.errors?.['required'] && registerForm.get('password')?.touched" 
                       class="text-danger">
                    Şifre zorunludur
                  </div>
                  <div *ngIf="registerForm.get('password')?.errors?.['minlength'] && registerForm.get('password')?.touched" 
                       class="text-danger">
                    Şifre en az 6 karakter olmalıdır
                  </div>
                </div>

                <button type="submit" class="btn btn-primary w-100" [disabled]="registerForm.invalid">
                  Kayıt Ol
                </button>

                <div *ngIf="error" class="alert alert-danger mt-3">
                  {{ error }}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  imports: [ReactiveFormsModule, NgIf],
  standalone: true
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      this.authService.register(name, email, password).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = err.error.message || 'Kayıt olurken bir hata oluştu';
        }
      });
    }
  }
} 