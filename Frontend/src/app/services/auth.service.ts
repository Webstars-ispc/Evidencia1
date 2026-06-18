import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth';
  logueado = signal(this._tokenValido());

  constructor(private http: HttpClient) {}

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

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.logueado.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return this.logueado();
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    this.logueado.set(false);
  }
}
