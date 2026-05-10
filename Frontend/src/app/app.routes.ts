import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
    path: 'about', 
    loadComponent: () => import('./features/about/about').then(c => c.AboutComponent) 
    },
];
