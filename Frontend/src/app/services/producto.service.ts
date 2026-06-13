import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8000/api/productos/';

  constructor(private http: HttpClient) { }

  private getHttpOptions() {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return { headers };
  }

  guardarProducto(producto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto).pipe(
      catchError(this.handleError)
    );
  }

  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  obtenerRubros(): Observable<any[]> {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/rubros/', this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  obtenerMarcas(): Observable<any[]> {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/marcas/', this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  // Read One (Obtener un producto por ID)
  obtenerProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  // Update (Actualizar producto entero)
  actualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, producto).pipe(
      catchError(this.handleError)
    );
  }

  // Delete (Eliminar producto)
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
