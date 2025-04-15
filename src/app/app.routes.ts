import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CancelComponent } from './cancel/cancel.component';
import { AboutComponent } from './about/about.component';
import { ErrorComponent } from './error/error.component';

export const routes: Routes = [
    {path: '', redirectTo: "home", pathMatch: "full"  }, 
    {path: 'home', component: HomeComponent},
    {path: 'cancel', component: CancelComponent},
    {path: 'about', component: AboutComponent},
    {path: '**', component: ErrorComponent },



    {path: "", redirectTo: "home", pathMatch: "full"},
   
    {
       path: "home",
       title: "Home",
       loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
    },
    {
      path: "cancel",
      title: "Tickets cancellation",
      loadComponent: () => import('./cancel/cancel.component').then(m => m.CancelComponent)
   },
    {
        path: "about",
        title: "About",
        loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
     },
];
