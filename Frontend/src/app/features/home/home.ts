import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  userName = signal('Franco');
  userRole = signal('Administrador');

  // stats cards
  ventasHoy = signal(4500);
  ventasMes = signal(125000);
  stockCritico = signal(5);
  topVendedor = signal({ nombre: 'Carlos Ruiz', ventas: 1200 });

  // botones
  quickActions = [
    { label: 'Nueva Venta', icon: '➕', route: '/ventas/nueva', color: 'success' },
    { label: 'Escanear Código', icon: '📱', route: '/escanear', color: 'primary' },
    { label: 'Ver Catálogo', icon: '📋', route: '/catalogo', color: 'dark' },
    { label: 'Gestionar Equipo', icon: '👥', route: '/equipo', color: 'secondary' },
  ];

  // top 5 productos mas vendidos
  topProductos = [
    { nombre: 'Pintura Acrílica Azul (Set 12)', categoria: 'Categoría', precio: 4500, unidades: 10, total: 4500 },
    { nombre: 'Lápiz Grafito Staedtler HB', categoria: 'Ejemplo', precio: 60, unidades: 20, total: 1200 },
    { nombre: 'Lápiz Grafito Staedtler', categoria: 'Ejemplo', precio: 50, unidades: 20, total: 1000 },
    { nombre: 'Pintura Acrílica Azul 4KI', categoria: 'Pinturía', precio: 50, unidades: 6, total: 300 },
    { nombre: 'Pintura Acrílica (Set 12)', categoria: 'Librería', precio: 50, unidades: 10, total: 500 },
  ];

  // datos para grafico de ventas semanales
  ventasSemanales = [
    { dia: '15/05', monto: 500 },
    { dia: '03/05', monto: 3000 },
    { dia: '26/05', monto: 1500 },
    { dia: '14/05', monto: 1000 },
    { dia: '25/05', monto: 2200 },
    { dia: '28/05', monto: 3500 },
    { dia: '08/05', monto: 1800 },
    { dia: '01/05', monto: 4500 },
    { dia: '07/05', monto: 5000 },
  ];

  // filtro de fechas
  filtroFecha = signal('7');
  fechaDesde = signal('');
  fechaHasta = signal('');

  isCustomRange = computed(() => this.filtroFecha() === 'custom');

  rangoSeleccionado = computed(() => {
    const opciones: Record<string, string> = {
      '1': 'Último día',
      '7': 'Últimos 7 días',
      '30': 'Últimos 30 días',
      '90': 'Últimos 90 días',
      '180': 'Últimos 180 días',
      '365': 'Último año',
      'custom': `${this.formatearFecha(this.fechaDesde())} - ${this.formatearFecha(this.fechaHasta())}`,
    };
    return opciones[this.filtroFecha()] || 'Últimos 7 días';
  });

  formatearFecha(fecha: string): string {
    if (!fecha) return 'dd/mm/aaaa';
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }

  onFilterChange(event: Event) {
    this.filtroFecha.set((event.target as HTMLSelectElement).value);
  }

  onFechaDesdeChange(event: Event) {
    this.fechaDesde.set((event.target as HTMLInputElement).value);
  }

  onFechaHastaChange(event: Event) {
    this.fechaHasta.set((event.target as HTMLInputElement).value);
  }
}
