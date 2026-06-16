import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

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
    title: 'Iniciar Sesión',
    canActivate: [guestGuard]
  },
{
    path: 'equipo',
    loadComponent: () => import('./features/equipo/equipo').then(c => c.GestionarEquipo),
    canActivate: [authGuard, adminGuard],   // ← Verifica autenticación Y rol
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
    loadComponent: () => import('./features/not-found/not-found').then(c => c.NotFound),
    title: 'Página No Encontrada'
  }
];
