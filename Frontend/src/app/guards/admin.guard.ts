import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';


//solo adminitradores pueden acceder a gestion de equipo
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.getProfile().pipe(
    map(profile => {
      if (profile.role === 'Administrador') {
        return true;
      }
      return router.parseUrl('/home');
    }),
    catchError(() => {
      return of(router.parseUrl('/login'));
    })
  );
};