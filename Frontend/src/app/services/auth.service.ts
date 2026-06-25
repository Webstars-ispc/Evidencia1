import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth';
  logueado = signal(this._tokenValido());
  private router = inject(Router);

  // Señal para el modal de expiración
  mostrarModalExpiracion = signal(false);
  private intervaloVerificacion: any;

  constructor(private http: HttpClient) { }

  private _tokenValido(): boolean {
    return !!localStorage.getItem('access_token');
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, { email, password });
  }

  getProfile(): Observable<{ username: string; email: string; role: string }> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<{ username: string; email: string; role: string }>(
      `${this.apiUrl}/me/`,
      { headers }
    ).pipe(
      tap(profile => {
        localStorage.setItem('user_role', profile.role);
      })
    );
  }

  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'Administrador';
  }

  saveTokens(access: string, refresh: string): void {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    this.logueado.set(true);
    this.iniciarVerificacionExpiracion();
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return this.logueado();
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    this.logueado.set(false);
    this.detenerVerificacion();
    this.mostrarModalExpiracion.set(false);
  }

  // Iniciar verificación de expiración
  iniciarVerificacionExpiracion(): void {
    this.detenerVerificacion();
    this.intervaloVerificacion = setInterval(() => {
      const token = this.getToken();
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiracion = payload.exp * 1000;
        const ahora = Date.now();
        const tiempoRestante = expiracion - ahora;

        // Si faltan menos de 5 minutos, mostrar modal
        if (tiempoRestante <= 300000 && tiempoRestante > 0) {
          this.mostrarModalExpiracion.set(true);
        }

        // Si ya expiró, cerrar sesión
        if (ahora >= expiracion) {
          this.logout();
          this.router.navigate(['/login']);
        }
      } catch (e) {
        this.logout();
        this.router.navigate(['/login']);
      }
    }, 3000);
  }

  // Extender la sesión
  extenderSesion(): void {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      this.logout();
      this.router.navigate(['/login']);
      return;
    }

    this.http.post(`${this.apiUrl}/refresh/`, { refresh }).subscribe({
      next: (resp: any) => {
        localStorage.setItem('access_token', resp.access);
        this.logueado.set(true);
        this.mostrarModalExpiracion.set(false);
      },
      error: () => {
        this.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  detenerVerificacion(): void {
    if (this.intervaloVerificacion) {
      clearInterval(this.intervaloVerificacion);
      this.intervaloVerificacion = null;
    }
  }
}