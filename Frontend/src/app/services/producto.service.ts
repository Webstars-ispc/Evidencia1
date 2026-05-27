import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://127.0.0.1:8000/api/productos/';

  constructor(private http: HttpClient) { }

  guardarProducto(producto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto);
  }
}
