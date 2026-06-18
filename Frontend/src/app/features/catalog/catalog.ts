import { Component, signal, computed, OnInit, inject, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ProductoService } from '../../services/producto.service';
import { Router, RouterLink } from '@angular/router';
import { DeleteModal } from './components/delete-modal/delete-modal';
import { BarcodeScanner } from '../../shared/components/barcode-scanner/barcode-scanner';
import { Volver } from '../../shared/components/volver/volver';

interface Producto {
  id: number;
  nombre: string;
  codigo_barras: string;
  rubro: number;
  marca: number | null;
  precio_costo: number;
  precio_venta: number;
  stock: number;
  fecha_creacion: string;
  vendidos?: number;
  rubro_nombre?: string;
  marca_nombre?: string;
}

interface MensajeEscaneo {
  tipo: 'success' | 'danger';
  texto: string;
}

@Component({
  selector: 'app-catalog',
  imports: [RouterLink, DeleteModal, BarcodeScanner, Volver],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  private http = inject(HttpClient);
  private productoService = inject(ProductoService);
  private router = inject(Router);

  productos = signal<Producto[]>([]);
  busqueda = signal('');
  paginaActual = signal(1);
  seleccionados = signal<Record<number, boolean>>({});
  sugerenciasAbiertas = signal(false);
  mostrandoModal = signal(false);
  cargando = signal(true);
  mensajeEscaneo = signal<MensajeEscaneo | null>(null);
  mostrandoCargaExcel = signal(false);
  cargandoExcel = signal(false);
  mensajeExcel = signal('');
  errorExcel = signal('');

  // Filtros
  filtroRubroTexto = signal('');
  filtroMarcaTexto = signal('');
  sugerenciasRubroAbiertas = signal(false);
  sugerenciasMarcaAbiertas = signal(false);

  private mensajeTimeout: ReturnType<typeof setTimeout> | null = null;
  private ultimoCodigoEscaneado = '';

  rubroMap = new Map<number, string>();
  marcaMap = new Map<number, string>();

  readonly PAGINA_TAMANIO = 50;

  columnas = [
    { key: 'nombre', label: 'Producto' },
    { key: 'codigo_barras', label: 'Código Barras' },
    { key: 'rubro', label: 'Rubro' },
    { key: 'marca', label: 'Marca' },
    { key: 'precio_costo', label: 'Precio Costo' },
    { key: 'precio_venta', label: 'Precio Venta' },
    { key: 'stock', label: 'Stock' },
    { key: 'vendidos', label: 'Vendidos (30d)' },
    { key: 'fecha_creacion', label: 'Fecha Creación' },
  ];

  sugerenciasVisibles = computed(() =>
    this.sugerenciasAbiertas() && this.sugerencias().length > 0
  );

  busquedaActiva = computed(() => this.busqueda().length >= 3);

  sugerencias = computed(() => {
    if (!this.busquedaActiva()) return [];
    const q = this.busqueda().toLowerCase();
    return this.productos()
      .filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          (p.codigo_barras && p.codigo_barras.includes(q)) ||
          (p.rubro_nombre && p.rubro_nombre.toLowerCase().includes(q)) ||
          (p.marca_nombre && p.marca_nombre.toLowerCase().includes(q))
      )
      .sort(
        (a, b) =>
          new Date(b.fecha_creacion).getTime() -
          new Date(a.fecha_creacion).getTime()
      )
      .slice(0, 5);
  });

  sugerenciasRubro = computed(() => {
    const q = this.filtroRubroTexto().toLowerCase();
    if (!q) return [];
    const rubrosUnicos = new Map<number, string>();
    this.productos().forEach(p => {
      if (p.rubro && p.rubro_nombre) {
        rubrosUnicos.set(p.rubro, p.rubro_nombre);
      }
    });
    return Array.from(rubrosUnicos.entries())
      .filter(([id, nombre]) => nombre.toLowerCase().includes(q))
      .map(([id, nombre]) => ({ id, nombre }))
      .slice(0, 5);
  });

  sugerenciasMarca = computed(() => {
    const q = this.filtroMarcaTexto().toLowerCase();
    if (!q) return [];
    const marcasUnicas = new Map<number, string>();
    this.productos().forEach(p => {
      if (p.marca && p.marca_nombre && p.marca_nombre !== '—') {
        marcasUnicas.set(p.marca, p.marca_nombre);
      }
    });
    return Array.from(marcasUnicas.entries())
      .filter(([id, nombre]) => nombre.toLowerCase().includes(q))
      .map(([id, nombre]) => ({ id, nombre }))
      .slice(0, 5);
  });

  productosFiltrados = computed(() => {
    let resultado = this.busquedaActiva() ? [...this.sugerencias()] : [...this.productos()];

    if (this.filtroRubroTexto()) {
      const q = this.filtroRubroTexto().toLowerCase();
      resultado = resultado.filter(p =>
        p.rubro_nombre && p.rubro_nombre.toLowerCase().includes(q)
      );
    }

    if (this.filtroMarcaTexto()) {
      const q = this.filtroMarcaTexto().toLowerCase();
      resultado = resultado.filter(p =>
        p.marca_nombre && p.marca_nombre.toLowerCase().includes(q)
      );
    }

    return resultado.sort(
      (a, b) =>
        new Date(b.fecha_creacion).getTime() -
        new Date(a.fecha_creacion).getTime()
    );
  });

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.productosFiltrados().length / this.PAGINA_TAMANIO))
  );

  productosPagina = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.PAGINA_TAMANIO;
    return this.productosFiltrados().slice(inicio, inicio + this.PAGINA_TAMANIO);
  });

  paginasVisibles = computed(() => {
    const total = this.totalPaginas();
    const actual = this.paginaActual();
    const rango: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) rango.push(i);
    } else {
      rango.push(1);
      if (actual > 3) rango.push('...');
      for (let i = Math.max(2, actual - 1); i <= Math.min(total - 1, actual + 1); i++) {
        rango.push(i);
      }
      if (actual < total - 2) rango.push('...');
      rango.push(total);
    }
    return rango;
  });

  todosSeleccionados = computed(
    () =>
      this.productosPagina().length > 0 &&
      this.productosPagina().every((p) => this.seleccionados()[p.id])
  );

  cantidadSeleccionados = computed(() => Object.keys(this.seleccionados()).length);
  puedeEliminar = computed(() => this.cantidadSeleccionados() >= 1);
  puedeEditar = computed(() => this.cantidadSeleccionados() === 1);

  ngOnInit() {
    this.cargarCatalogos();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.search-wrapper')) {
      this.sugerenciasAbiertas.set(false);
    }
    if (!(event.target as HTMLElement).closest('.filter-wrapper')) {
      this.sugerenciasRubroAbiertas.set(false);
      this.sugerenciasMarcaAbiertas.set(false);
    }
  }

  onSearchFocus() {
    if (this.busquedaActiva()) {
      this.sugerenciasAbiertas.set(true);
    }
  }

  cargarCatalogos() {
    this.cargando.set(true);

    forkJoin({
      rubros: this.productoService.obtenerRubros(),
      marcas: this.productoService.obtenerMarcas(),
      productos: this.productoService.obtenerProductos(),
    }).subscribe({
      next: ({ rubros, marcas, productos }) => {
        rubros.forEach((r) => this.rubroMap.set(r.id, r.nombre));
        marcas.forEach((m) => this.marcaMap.set(m.id, m.nombre));

        this.productos.set(
          productos.map((p: any) => ({
            id: p.id,
            nombre: p.nombre || '',
            codigo_barras: p.codigo_barras || '',
            rubro: p.rubro,
            marca: p.marca,
            precio_costo: Number(p.precio_costo) || 0,
            precio_venta: Number(p.precio_venta) || 0,
            stock: Number(p.stock) || 0,
            fecha_creacion: p.fecha_creacion || '',
            rubro_nombre: this.rubroMap.get(p.rubro) || `Rubro #${p.rubro}`,
            marca_nombre: p.marca ? this.marcaMap.get(p.marca) || `Marca #${p.marca}` : '—',
          }))
        );
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando catálogo:', err);
        this.cargando.set(false);
      },
    });
  }

  onBusquedaChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.busqueda.set(value);
    this.paginaActual.set(1);
    this.sugerenciasAbiertas.set(value.length >= 3);
  }

  onFiltroRubroChange(event: Event) {
    this.filtroRubroTexto.set((event.target as HTMLInputElement).value);
    this.sugerenciasRubroAbiertas.set(true);
    this.paginaActual.set(1);
  }

  onFiltroMarcaChange(event: Event) {
    this.filtroMarcaTexto.set((event.target as HTMLInputElement).value);
    this.sugerenciasMarcaAbiertas.set(true);
    this.paginaActual.set(1);
  }

  seleccionarRubro(rubro: { id: number; nombre: string }) {
    this.filtroRubroTexto.set(rubro.nombre);
    this.sugerenciasRubroAbiertas.set(false);
  }

  seleccionarMarca(marca: { id: number; nombre: string }) {
    this.filtroMarcaTexto.set(marca.nombre);
    this.sugerenciasMarcaAbiertas.set(false);
  }

  limpiarFiltroRubro() {
    this.filtroRubroTexto.set('');
    this.paginaActual.set(1);
  }

  limpiarFiltroMarca() {
    this.filtroMarcaTexto.set('');
    this.paginaActual.set(1);
  }

  seleccionarSugerencia(producto: Producto) {
    this.busqueda.set('');
    this.paginaActual.set(1);
    this.seleccionados.set({ [producto.id]: true });
    this.sugerenciasAbiertas.set(false);
  }

  isSelected(id: number): boolean {
    return !!this.seleccionados()[id];
  }

  toggleSeleccion(id: number) {
    const s = { ...this.seleccionados() };
    if (s[id]) delete s[id];
    else s[id] = true;
    this.seleccionados.set(s);
  }

  toggleSeleccionTodos() {
    if (this.todosSeleccionados()) {
      this.seleccionados.set({});
    } else {
      const sel: Record<number, boolean> = {};
      this.productosPagina().forEach((p) => (sel[p.id] = true));
      this.seleccionados.set(sel);
    }
  }

  irPagina(pagina: number | string) {
    if (typeof pagina === 'number') {
      this.paginaActual.set(pagina);
    }
  }

  abrirModal() {
    this.mostrandoModal.set(true);
  }

  cerrarModal() {
    this.mostrandoModal.set(false);
  }

  confirmarEliminacion() {
    const ids = Object.keys(this.seleccionados()).map(Number);
    let completados = 0;

    ids.forEach((id) => {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          completados++;
          if (completados === ids.length) {
            this.productos.update((p) => p.filter((prod) => !ids.includes(prod.id)));
            this.seleccionados.set({});
            this.cerrarModal();
            this.paginaActual.set(1);
          }
        },
        error: () => {
          completados++;
          if (completados === ids.length) {
            this.cargarCatalogos();
            this.seleccionados.set({});
            this.cerrarModal();
          }
        },
      });
    });
  }

  celdaValue(producto: Producto, key: string): string {
    switch (key) {
      case 'precio_costo':
      case 'precio_venta':
        return `$${Number(producto[key as 'precio_costo' | 'precio_venta']).toFixed(2)}`;
      case 'fecha_creacion':
        return new Date(producto.fecha_creacion).toLocaleDateString('es-AR', {
          day: '2-digit', month: '2-digit', year: 'numeric',
        });
      case 'marca':
        return producto.marca_nombre || '—';
      case 'rubro':
        return producto.rubro_nombre || `#${producto.rubro}`;
      case 'vendidos':
        return producto.vendidos != null ? String(producto.vendidos) : '—';
      default: {
        const v = (producto as any)[key];
        return v != null ? String(v) : '—';
      }
    }
  }

  irAEditar(): void {
    if (!this.puedeEditar()) return;
    const id = +Object.keys(this.seleccionados())[0];
    if (id) {
      this.router.navigate(['/editar-producto', id]);
    }
  }

  onCodigoEscaneado(codigo: string): void {
    const codigoLimpio = (codigo ?? '').trim();
    if (!codigoLimpio) return;
    if (codigoLimpio === this.ultimoCodigoEscaneado) return;
    this.ultimoCodigoEscaneado = codigoLimpio;
    setTimeout(() => { this.ultimoCodigoEscaneado = ''; }, 2000);

    const encontrado = this.productos().find(
      (p) => p.codigo_barras && p.codigo_barras === codigoLimpio
    );

    if (!encontrado) {
      this.mostrarMensaje({
        tipo: 'danger',
        texto: `No se encontró ningún producto con el código "${codigoLimpio}".`,
      });
      return;
    }

    this.busqueda.set('');
    this.sugerenciasAbiertas.set(false);
    this.seleccionados.set({ [encontrado.id]: true });

    const index = this.productos().findIndex((p) => p.id === encontrado.id);
    const pagina = Math.floor(index / this.PAGINA_TAMANIO) + 1;
    this.paginaActual.set(pagina);

    this.mostrarMensaje({
      tipo: 'success',
      texto: `Producto "${encontrado.nombre}" encontrado.`,
    });

    setTimeout(() => {
      const row = document.querySelector(
        `[data-producto-id="${encontrado.id}"]`
      );
      row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  }

  private mostrarMensaje(msg: MensajeEscaneo): void {
    this.mensajeEscaneo.set(msg);
    if (this.mensajeTimeout) clearTimeout(this.mensajeTimeout);
    this.mensajeTimeout = setTimeout(() => this.mensajeEscaneo.set(null), 5000);
  }

  abrirCargaExcel() {
    this.mostrandoCargaExcel.set(true);
    this.mensajeExcel.set('');
    this.errorExcel.set('');
  }

  cerrarCargaExcel() {
    this.mostrandoCargaExcel.set(false);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.subirExcel(input.files[0]);
    }
  }

  subirExcel(archivo: File) {
    this.cargandoExcel.set(true);
    this.mensajeExcel.set('');
    this.errorExcel.set('');

    const formData = new FormData();
    formData.append('archivo', archivo);

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post('http://127.0.0.1:8000/api/cargar-excel/', formData, { headers }).subscribe({
      next: (resp: any) => {
        this.mensajeExcel.set(resp.mensaje);
        this.cargandoExcel.set(false);
        setTimeout(() => {
          this.cerrarCargaExcel();
          this.cargarCatalogos();
        }, 2000);
      },
      error: (err) => {
        this.errorExcel.set(err.error?.error || 'Error al subir el archivo.');
        this.cargandoExcel.set(false);
      }
    });
  }
}