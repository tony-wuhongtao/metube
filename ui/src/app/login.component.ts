import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="row w-100 justify-content-center">
        <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <div class="card shadow-lg border-0 rounded-3">
            <div class="card-body p-5">
              <!-- Logo and Title -->
              <div class="text-center mb-5">
                <div class="d-flex justify-content-center mb-3">
                  <img src="assets/icons/android-chrome-192x192.png" alt="YaoTube Logo" height="64" class="me-3">
                </div>
                <h1 class="h2 mb-1">YaoTube</h1>
                <p class="text-muted">Sign in to your account</p>
              </div>

              <!-- Error Message -->
              <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                {{ errorMessage }}
                <button type="button" class="btn-close" (click)="errorMessage=''"></button>
              </div>

              <!-- Login Form -->
              <form (ngSubmit)="login()" #loginForm="ngForm">
                <div class="mb-4">
                  <label for="username" class="form-label fw-bold">Username</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                      </svg>
                    </span>
                    <input type="text" class="form-control form-control-lg" id="username" [(ngModel)]="username" name="username" required #usernameInput="ngModel" placeholder="Enter your username">
                  </div>
                  <div *ngIf="usernameInput.invalid && usernameInput.touched" class="text-danger mt-1">
                    <small>Username is required</small>
                  </div>
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label fw-bold">Password</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                      </svg>
                    </span>
                    <input type="password" class="form-control form-control-lg" id="password" [(ngModel)]="password" name="password" required #passwordInput="ngModel" placeholder="Enter your password">
                  </div>
                  <div *ngIf="passwordInput.invalid && passwordInput.touched" class="text-danger mt-1">
                    <small>Password is required</small>
                  </div>
                </div>

                <div class="d-grid">
                  <button type="submit" class="btn btn-primary btn-lg rounded-pill" [disabled]="loading || loginForm.invalid">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <span *ngIf="loading">Signing in...</span>
                    <span *ngIf="!loading">Sign in</span>
                  </button>
                </div>
              </form>

              <!-- Footer -->
              <div class="text-center mt-4">
                <p class="text-muted mb-0">
                  <small>© {{ currentYear }} YaoTube by Tony&#64;YaoCheng Studio. All rights reserved.</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .card {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
    }
    
    .form-control:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .input-group-text {
      background-color: #f8f9fa;
      border-right: none;
    }
    
    .form-control {
      border-left: none;
    }
    
    .input-group:focus-within .input-group-text,
    .input-group:focus-within .form-control {
      border-color: #667eea;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  loading = false;
  currentYear = new Date().getFullYear();

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.loading = true;
    this.errorMessage = '';

    const loginData = {
      username: this.username,
      password: this.password
    };

    const baseUrl = `${window.location.origin}${window.location.pathname.replace(/\/[^\/]*$/, '/')}`;
    const loginUrl = `${baseUrl}api/login`;

    this.http.post(loginUrl, loginData).subscribe({
      next: (response: any) => {
        this.loading = false;
        // Redirect to home page
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }
}