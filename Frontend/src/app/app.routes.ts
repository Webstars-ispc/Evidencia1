import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'catalogo',
    pathMatch: 'full',
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
    path: 'cargar-producto',
    loadComponent: () => import('./features/cargar-producto/cargar-producto').then(c => c.CargarProducto),
    title: 'Registrar Producto',
    canActivate: [authGuard]
  },
  {
    path: 'editar-producto/:id',
    loadComponent: () => import('./features/editar-producto/editar-producto').then(c => c.EditarProducto),
    title: 'Editar Producto',
    canActivate: [authGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then(c => c.Home),
    title: 'Panel Principal',
    canActivate: [authGuard]
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./features/catalog/catalog').then(c => c.Catalog),
    title: 'Catálogo de Productos',
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];
