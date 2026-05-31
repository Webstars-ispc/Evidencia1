import { Routes } from '@angular/router';
import { Hero } from './features/hero/hero';

export const routes: Routes = [
  {
    path: '',
    component: Hero,
    pathMatch: 'full',
    title: 'Librería Nazareth - Inicio'
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about').then(c => c.AboutComponent),
    title: 'Sobre Nosotros'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(c => c.Login),
    title: 'Iniciar Sesión'
  },
  {
    path: 'menu',
    loadComponent: () => import('./features/menu/menu.component').then(c => c.MenuComponent),
    title: 'Menú de Operaciones'
  },
  {
    path: 'cargar-producto',
    loadComponent: () => import('./features/cargar-producto/cargar-producto').then(c => c.CargarProducto),
    title: 'Registrar Producto'
  },
  {
    path: 'info',
    loadComponent: () => import('./features/info/info').then(c => c.Info),
    title: 'Información del Sistema'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then(c => c.Home),
    title: 'Panel Principal'
  },
  {
    path: 'stock',
    loadComponent: () => import('./features/stock/stock.component').then(c => c.StockComponent),
    title: 'Gestión de Inventario'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];
