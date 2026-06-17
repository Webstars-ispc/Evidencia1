import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  userName = signal('');
  userRole = signal('');
  totalProductos = signal(0);
  stockCritico = signal(0);
  productos = signal<any[]>([]);
  marcas = signal<any[]>([]);
  rubros = signal<any[]>([]);

  ventasHoy = signal(0);
  ventasMes = signal(0);
  topVendedor = signal({ nombre: 'Sin datos', ventas: 0 });
  rangoSeleccionado = signal('Últimos 7 días');
  isCustomRange = signal(false);
  fechaDesde = signal('');
  fechaHasta = signal('');

  quickActions = [
    /* { icon: '➕', label: 'Nueva Venta', route: '/ventas/nueva', color: 'success' }, */
    { icon: '📦', label: 'Ver Catálogo', route: '/catalogo' },
    { icon: '➕', label: 'Cargar Producto', route: '/cargar-producto' },
    { icon: '👥', label: 'Gestionar Equipo', route: '/equipo', color: 'secondary' },
  ];

  // Inicializadas como arrays planos (no signals) para que el @for funcione
  ventasSemanales = [
    { dia: 'Lun', monto: 3500 },
    { dia: 'Mar', monto: 4200 },
    { dia: 'Mié', monto: 3800 },
    { dia: 'Jue', monto: 4500 },
    { dia: 'Vie', monto: 5000 },
    { dia: 'Sáb', monto: 2800 },
    { dia: 'Dom', monto: 1500 }
  ];

  topProductos = [
    { nombre: 'Cuaderno Rivadavia', categoria: 'Librería', precio: 850, unidades: 45, total: 38250 },
    { nombre: 'Lapicera Bic Azul', categoria: 'Librería', precio: 120, unidades: 120, total: 14400 },
    { nombre: 'Resma de papel A4', categoria: 'Librería', precio: 1800, unidades: 20, total: 36000 },
    { nombre: 'Pelota de fútbol N°5', categoria: 'Juguetería', precio: 3500, unidades: 8, total: 28000 },
    { nombre: 'Vela aromática', categoria: 'Regalería', precio: 600, unidades: 35, total: 21000 }
  ];

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getHomeData().subscribe({
      next: (data) => {
        this.userName.set(data.userName);
        this.userRole.set(data.userRole);
        this.totalProductos.set(data.totalProductos);
        this.stockCritico.set(data.stockCritico);
        this.productos.set(data.productos);
        this.marcas.set(data.marcas);
        this.rubros.set(data.rubros);
      },
      error: (err) => {
        console.error('Error al cargar datos del home:', err);
      }
    });
  }

  onFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.rangoSeleccionado.set(select.options[select.selectedIndex].text);
    this.isCustomRange.set(select.value === 'custom');
  }

  onFechaDesdeChange(event: Event) {
    this.fechaDesde.set((event.target as HTMLInputElement).value);
  }

  onFechaHastaChange(event: Event) {
    this.fechaHasta.set((event.target as HTMLInputElement).value);
  }
}
