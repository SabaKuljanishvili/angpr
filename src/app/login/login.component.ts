import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = 'eve.holt@reqres.in';
  password = 'cityslicka';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('authToken', res.token);
        this.successMessage = `წარმატებით დაელოგინე! Token: ${res.token}`;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'დაფიქსირდა შეცდომა';
        this.successMessage = '';
      },
    });
  }
}
