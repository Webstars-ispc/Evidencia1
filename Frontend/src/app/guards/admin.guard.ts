import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';


//solo adminitradores pueden acceder a gestion de equipo
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getRole();
  if (role === 'Administrador') return true;
  if (role !== null) return router.parseUrl('/catalogo');

  return auth.getProfile().pipe(
    map(profile => {
      if (profile.role === 'Administrador') {
        return true;
      }
      return router.parseUrl('/catalogo');
    }),
    catchError(() => {
      return of(router.parseUrl('/login'));
    })
  );
};