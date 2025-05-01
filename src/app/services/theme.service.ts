import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = signal<'dark' | 'light'>('dark');

  constructor() {

    this.applyTheme(this.currentTheme());

    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
    });
  }

  setTheme(theme: 'dark' | 'light') {
    this.currentTheme.set(theme);
  }

  getTheme() {
    return this.currentTheme.asReadonly();
  }

  private applyTheme(theme: 'dark' | 'light') {
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--bg-dark', '#1a1a2e');
      document.body.style.backgroundColor = 'var(--bg-dark)';
    } else {
      document.documentElement.style.setProperty('--bg-dark', '#ffffff');
      document.body.style.backgroundColor = 'var(--bg-dark)';
    }
  }
}
