import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  cargando = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Completá todos los campos.';
      return;
    }

    this.cargando.set(true);

    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        this.authService.saveToken(response.access);
        this.successMessage = '✅ Login exitoso. Redirigiendo...';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: (error) => {
        this.cargando.set(false);
        const msg = error.error?.detail || error.error?.[0];
        if (msg) {
          this.errorMessage = msg;
        } else if (error.status === 401 || error.status === 400) {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
        } else {
          this.errorMessage = 'Error de conexión con el servidor.';
        }
      }
    });
  }
}
