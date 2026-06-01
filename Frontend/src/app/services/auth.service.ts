import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    this.logueado.set(false);
  }
}
