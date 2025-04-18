import { Component } from '@angular/core';
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
}
