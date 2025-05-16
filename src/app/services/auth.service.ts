<<<<<<< HEAD
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
=======
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

>>>>>>> 611bb31a879a79bdc2ce64c29c334c0dc78e6ea0

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated() {
    throw new Error('Method not implemented.');
  }
    private apiUrl = 'https://reqres.in/api';

<<<<<<< HEAD
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
  
=======
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }
   
>>>>>>> 611bb31a879a79bdc2ce64c29c334c0dc78e6ea0
}
