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
    path: 'menu',
    loadComponent: () => import('./features/menu/menu.component').then(c => c.MenuComponent)
  },
  {
    path: 'cargar-producto',
    loadComponent: () => import('./features/cargar-producto/cargar-producto').then(c => c.CargarProducto)
  },
  {
    path: 'info',
    loadComponent: () => import('./features/info/info').then(c => c.Info)
  },
];
