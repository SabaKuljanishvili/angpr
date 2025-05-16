import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://reqres.in/api';
  isAuthenticated = signal(!!this.getToken());

  constructor(private http: HttpClient, private router: Router) {}

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
