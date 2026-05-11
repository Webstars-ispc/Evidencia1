import { Routes } from '@angular/router';
import { Hero } from './hero/hero';

export const routes: Routes = [
    { 
        path: '', 
        component: Hero
    },
    { 
        path: 'about', 
        loadComponent: () => import('./features/about/about').then(c => c.AboutComponent) 
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login').then(c => c.Login)
    },
];