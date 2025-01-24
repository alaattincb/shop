import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="text-center mb-4">Giriş Yap</h2>
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" formControlName="email">
                  <div *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched" 
                       class="text-danger">
                    Email zorunludur
                  </div>
                  <div *ngIf="loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched" 
                       class="text-danger">
                    Geçerli bir email adresi giriniz
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Şifre</label>
                  <input type="password" class="form-control" formControlName="password">
                  <div *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched" 
                       class="text-danger">
                    Şifre zorunludur
                  </div>
                </div>

                <button type="submit" class="btn btn-primary w-100" [disabled]="loginForm.invalid">
                  Giriş Yap
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
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = err.error.message || 'Giriş yapılırken bir hata oluştu';
        }
      });
    }
  }
} 