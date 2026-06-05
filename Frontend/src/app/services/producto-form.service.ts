import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ProductoService } from './producto.service';

export interface Rubro {
  id: number;
  nombre: string;
}

export interface Marca {
  id: number;
  nombre: string;
}

export interface ProductoDetalle {
  id: number;
  nombre: string;
  descripcion: string | null;
  codigo_barras: string | null;
  precio_costo: number | string;
  precio_venta: number | string;
  stock: number;
  rubro: number;
  marca: number | null;
  fecha_creacion?: string;
}

export type ProductoForm = FormGroup<{
  nombre: FormControl<string>;
  descripcion: FormControl<string>;
  codigo_barras: FormControl<string>;
  precio_costo: FormControl<string>;
  precio_venta: FormControl<string>;
  stock: FormControl<string>;
  rubro: FormControl<string>;
}>;

@Injectable({ providedIn: 'root' })
export class ProductoFormService {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly http = inject(HttpClient);
  private readonly productoService = inject(ProductoService);

  readonly rubros = signal<Rubro[]>([]);
  readonly marcas = signal<Marca[]>([]);
  readonly cargandoCatalogos = signal(true);
  readonly cargandoProducto = signal(false);
  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly marcaNueva = signal<string>('');

  readonly form: ProductoForm = this.fb.group({
    nombre: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    descripcion: this.fb.control(''),
    codigo_barras: this.fb.control('', [Validators.pattern(/^[0-9]{8,13}$/)]),
    precio_costo: this.fb.control('', [Validators.required, Validators.min(0.01)]),
    precio_venta: this.fb.control('', [Validators.required, Validators.min(0.01)]),
    stock: this.fb.control('0', [Validators.required, Validators.min(0)]),
    rubro: this.fb.control('', [Validators.required]),
  });

  cargarCatalogos(): void {
    this.cargandoCatalogos.set(true);
    forkJoin({
      rubros: this.http.get<Rubro[]>('http://localhost:8000/api/rubros/'),
      marcas: this.http.get<Marca[]>('http://localhost:8000/api/marcas/'),
    })
      .pipe(
        catchError((err) => {
          console.error('[ProductoFormService] Error cargando catálogos:', err);
          this.error.set('No se pudieron cargar los rubros y marcas.');
          return of({ rubros: [] as Rubro[], marcas: [] as Marca[] });
        })
      )
      .subscribe(({ rubros, marcas }) => {
        this.rubros.set(rubros);
        this.marcas.set(marcas);
        this.cargandoCatalogos.set(false);
      });
  }

  cargarProducto(id: number): void {
    this.cargandoProducto.set(true);
    this.productoService.obtenerProducto(id).subscribe({
      next: (p: ProductoDetalle) => {
        const marcaActual = this.marcas().find((m) => m.id === p.marca);
        this.marcaNueva.set(marcaActual?.nombre ?? '');

        this.form.patchValue({
          nombre: p.nombre ?? '',
          descripcion: p.descripcion ?? '',
          codigo_barras: p.codigo_barras ?? '',
          precio_costo: String(p.precio_costo ?? ''),
          precio_venta: String(p.precio_venta ?? ''),
          stock: String(p.stock ?? 0),
          rubro: String(p.rubro ?? ''),
        });
        this.cargandoProducto.set(false);
      },
      error: (err) => {
        console.error('[ProductoFormService] Error cargando producto:', err);
        this.error.set('No se pudo cargar el producto.');
        this.cargandoProducto.set(false);
      },
    });
  }

  enviar(id?: number): Observable<unknown> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Por favor, corregí los errores del formulario.');
      return of(null);
    }

    this.enviando.set(true);
    this.error.set(null);
    this.success.set(null);

    const payload = this.buildPayload();
    const request$ = id
      ? this.productoService.actualizarProducto(id, payload)
      : this.productoService.guardarProducto(payload);

    return request$.pipe(
      tap(() => {
        this.enviando.set(false);
        this.success.set(
          id ? 'Producto actualizado correctamente.' : 'Producto guardado correctamente.'
        );
      }),
      catchError((err) => {
        this.enviando.set(false);
        this.error.set(this.formatError(err));
        throw err;
      })
    );
  }

  resetear(): void {
    this.form.reset({
      nombre: '',
      descripcion: '',
      codigo_barras: '',
      precio_costo: '',
      precio_venta: '',
      stock: '0',
      rubro: '',
    });
    this.marcaNueva.set('');
    this.error.set(null);
    this.success.set(null);
  }

  private buildPayload() {
    const v = this.form.getRawValue();
    return {
      nombre: v.nombre.trim(),
      descripcion: v.descripcion.trim() || null,
      codigo_barras: v.codigo_barras.trim() || null,
      precio_costo: parseFloat(v.precio_costo),
      precio_venta: parseFloat(v.precio_venta),
      stock: parseInt(v.stock, 10),
      rubro: parseInt(v.rubro, 10),
      marca_nombre: this.marcaNueva().trim(),
    };
  }

  private formatError(err: any): string {
    if (!err) return 'Ocurrió un error al guardar el producto.';
    if (err.error) {
      if (typeof err.error === 'string') return err.error;
      if (err.error.detail) return err.error.detail;
      if (Array.isArray(err.error.non_field_errors) && err.error.non_field_errors.length) {
        return err.error.non_field_errors[0];
      }
      const fields = Object.keys(err.error);
      if (fields.length) {
        const field = fields[0];
        const value = err.error[field];
        if (Array.isArray(value) && value.length) return `${field}: ${value[0]}`;
        if (typeof value === 'string') return `${field}: ${value}`;
      }
    }
    return err.message || 'Ocurrió un error al guardar el producto.';
  }
}
