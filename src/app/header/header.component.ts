import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
     activeRouteClass = "active"


     isMenuOpen = false;
   
     toggleMenu(): void {
       this.isMenuOpen = !this.isMenuOpen;
     }
   
     closeMenu(): void {
       this.isMenuOpen = false;
     }
   
     @HostListener('window:resize', ['$event'])
     onResize(event: Event): void {
       const window = event.target as Window;
       if (window.innerWidth > 768) {
         this.closeMenu();
       }
     }
}
