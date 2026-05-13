import { Routes } from '@angular/router';
import { Hero } from './features/hero/hero';

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
        loadComponent: () => import('./features/login/login').then(c => c.Login)
    },
    {
        path: 'info',
        loadComponent: () => import('./features/info/info').then(c => c.Info)
    },
    {
        path: 'home',
        loadComponent: () => import('./features/home/home').then(c => c.Home)
    },
];