import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = 'https://reqres.in/api';
  
  isAuthenticated = signal(false);

  constructor() {
    this.isAuthenticated.set(!!this.getToken());
  }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'reqres-free-v1' 
    });

    return this.http.post(`${this.apiUrl}/login`, { email, password }, { headers }).pipe(
      catchError(error => {
        return throwError(() => this.handleLoginError(error));
      })
    );
  }

private handleLoginError(error: any): string {
  if (!error.error) return 'Connection error occurred';

  if (typeof error.error === 'string') return error.error;

  switch (error.error.error) {
    case 'user not found':
      return 'User not found';
    case 'Missing email or username':
      return 'Please enter your email';
    case 'Missing password':
      return 'Please enter your password';
    default:
      return error.error.error || 'Login failed';
  }
}

  logout(): void {
    localStorage.removeItem('auth_token');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
  
}
