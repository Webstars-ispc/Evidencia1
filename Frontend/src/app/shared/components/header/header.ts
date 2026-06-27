import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  auth = inject(AuthService);
  router = inject(Router);
  mostrandoModalLogout = signal(false);

  confirmarLogout() {
    this.mostrandoModalLogout.set(true);
  }

  cancelarLogout() {
    this.mostrandoModalLogout.set(false);
  }

  cerrarSesion() {
    this.auth.logout();
    this.mostrandoModalLogout.set(false);
    this.router.navigate(['/login']);
  }
}