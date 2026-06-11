import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/usuarios';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los headers con el token de autenticación.
   */
  private getHttpOptions() {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return { headers };
  }

  /** Listar todos los usuarios */
  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`, this.getHttpOptions());
  }

  /** Crear un nuevo usuario */
  crear(data: { username: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create/`, data, this.getHttpOptions());
  }

  /** Actualizar un usuario */
  actualizar(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/`, data, this.getHttpOptions());
  }

  /** Eliminar un usuario */
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/`, this.getHttpOptions());
  }
}