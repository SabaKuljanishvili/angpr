import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CancelComponent } from './cancel/cancel.component';
import { AboutComponent } from './about/about.component';
import { ErrorComponent } from './error/error.component';
import { TicketComponent } from './ticket/ticket.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {path: '', redirectTo: "home", pathMatch: "full"  }, 
    {path: 'home', component: HomeComponent},
    {path: 'cancel', component: CancelComponent},
    {path: 'ticket', component: TicketComponent},
    {path: 'about', component: AboutComponent},
    { path: 'login', component: LoginComponent },
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
      path: "ticket",
      title: "Tickets",
      loadComponent: () => import('./ticket/ticket.component').then(m => m.TicketComponent)
   },
    {
        path: "about",
        title: "About",
        loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
     },
         {
        path: "login",
        title: "login",
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
     },
];
