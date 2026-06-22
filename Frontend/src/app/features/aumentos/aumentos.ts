import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Volver } from '../../shared/components/volver/volver';

@Component({
  selector: 'app-aumentos',
  imports: [CommonModule, FormsModule, Volver],
  templateUrl: './aumentos.html',
  styleUrl: './aumentos.css'
})
export class Aumentos implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api';

  rubros: any[] = [];
  marcas: any[] = [];
  productos: any[] = [];

  tipoAumento = signal<string>('general');
  porcentaje = signal<number>(0);
  rubroId = signal<number | null>(null);
  marcaId = signal<number | null>(null);
  productoId = signal<number | null>(null);

  cargando = signal(false);
  mensaje = signal('');
  error = signal('');

  private getHttpOptions() {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return { headers };
  }

  ngOnInit(): void {
    forkJoin({
      rubros: this.http.get<any[]>(`${this.apiUrl}/rubros/`, this.getHttpOptions()),
      marcas: this.http.get<any[]>(`${this.apiUrl}/marcas/`, this.getHttpOptions()),
      productos: this.http.get<any[]>(`${this.apiUrl}/productos/`, this.getHttpOptions()),
    }).subscribe({
      next: ({ rubros, marcas, productos }) => {
        this.rubros = rubros;
        this.marcas = marcas;
        this.productos = productos;
      },
      error: (err) => console.error('Error cargando datos:', err)
    });
  }

  aplicarAumento(): void {
    if (!this.porcentaje()) {
      this.error.set('Ingresá un porcentaje válido.');
      return;
    }

    this.cargando.set(true);
    this.mensaje.set('');
    this.error.set('');

    let endpoint = '';
    let body: any = { porcentaje: this.porcentaje() };

    switch (this.tipoAumento()) {
      case 'general':
        endpoint = `${this.apiUrl}/aumentos/general/`;
        break;
      case 'rubro':
        if (!this.rubroId()) { this.error.set('Seleccioná un rubro.'); this.cargando.set(false); return; }
        endpoint = `${this.apiUrl}/aumentos/rubro/`;
        body.rubro_id = this.rubroId();
        break;
      case 'marca':
        if (!this.marcaId()) { this.error.set('Seleccioná una marca.'); this.cargando.set(false); return; }
        endpoint = `${this.apiUrl}/aumentos/marca/`;
        body.marca_id = this.marcaId();
        break;
      case 'individual':
        if (!this.productoId()) { this.error.set('Seleccioná un producto.'); this.cargando.set(false); return; }
        endpoint = `${this.apiUrl}/aumentos/individual/`;
        body.producto_id = this.productoId();
        break;
    }

    this.http.post(endpoint, body, this.getHttpOptions()).subscribe({
      next: (resp: any) => {
        this.mensaje.set(resp.mensaje);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Error al aplicar el aumento.');
        this.cargando.set(false);
      }
    });
  }
}