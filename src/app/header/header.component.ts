import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    private themeService: ThemeService,
    public authService: AuthService
  ) {}

  toggleTheme() {
    const current = this.themeService.getTheme()();
    this.themeService.setTheme(current === 'dark' ? 'light' : 'dark');
  }

     activeRouteClass = "active"


     isMenuOpen = false;
   
     toggleMenu(): void {
       this.isMenuOpen = !this.isMenuOpen;
     }
   
     closeMenu(): void {
       this.isMenuOpen = false;
     }
     logout() {
    this.authService.logout();
    this.closeMenu();
  }
     @HostListener('window:resize', ['$event'])
     onResize(event: Event): void {
       const window = event.target as Window;
       if (window.innerWidth > 768) {
         this.closeMenu();
       }
     }
     isDarkTheme = false;

}
