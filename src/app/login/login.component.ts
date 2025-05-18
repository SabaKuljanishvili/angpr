import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../services/services.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials = {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka'
  };
  isLoading = false;
  errorMessage = '';
  isCancelling = false;
  cancelMessage = '';

  constructor(
    public authService: AuthService, 
    private router: Router,
    private apiService: ApiService 
  ) {}

  get isLoggedIn() {
    return this.authService.isAuthenticated(); 
  }

  login() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.credentials.email, this.credentials.password)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          localStorage.setItem('auth_token', response.token);
          this.authService.isAuthenticated.set(true);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error;
        }
      });
  }

  logout() {
    this.authService.logout();
  }

  cancelAllTickets() {
    this.isCancelling = true;
    this.cancelMessage = '';

    this.apiService.cancelAllTickets().subscribe({
      next: (response) => {
        this.isCancelling = false;
        this.cancelMessage = 'All tickets successfully cancelled!';
      },
      error: (error) => {
        this.isCancelling = false;
        this.cancelMessage = 'Failed to cancel tickets: ' + (error.message || 'Unknown error');
      }
    });
  }
}
