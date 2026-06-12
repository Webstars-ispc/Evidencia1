import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'http://127.0.0.1:8000/api';

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

  /**
   * Obtiene todos los datos necesarios para el home.
   */
  getHomeData(): Observable<{
    userName: string;
    userRole: string;
    totalProductos: number;
    stockCritico: number;
    productos: any[];
    marcas: any[];
    rubros: any[];
  }> {
    const options = this.getHttpOptions();

    return forkJoin({
      userProfile: this.http.get<any>(`${this.apiUrl}/auth/me/`, options),
      productos: this.http.get<any[]>(`${this.apiUrl}/productos/`, options),
      marcas: this.http.get<any[]>(`${this.apiUrl}/marcas/`, options),
      rubros: this.http.get<any[]>(`${this.apiUrl}/rubros/`, options)
    }).pipe(
      map(({ userProfile, productos, marcas, rubros }) => {
        const stockCritico = productos.filter((p: any) => p.stock < 10).length;

        return {
          userName: userProfile.username,
          userRole: userProfile.role,
          totalProductos: productos.length,
          stockCritico: stockCritico,
          productos: productos,
          marcas: marcas,
          rubros: rubros
        };
      })
    );
  }
}
