import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductoFormService } from '../../services/producto-form.service';
import { BarcodeScanner } from '../../shared/components/barcode-scanner/barcode-scanner';
import { Volver } from '../../shared/components/volver/volver';

@Component({
  selector: 'app-registro-producto',
  imports: [ReactiveFormsModule, BarcodeScanner, Volver],
  templateUrl: './cargar-producto.html',
  styleUrl: './cargar-producto.css',
})
export class CargarProducto implements OnInit {
  private readonly formService = inject(ProductoFormService);
  private readonly router = inject(Router);

  readonly form = this.formService.form;
  readonly rubros = this.formService.rubros;
  readonly marcas = this.formService.marcas;
  readonly cargandoCatalogos = this.formService.cargandoCatalogos;
  readonly enviando = this.formService.enviando;
  readonly error = this.formService.error;
  readonly success = this.formService.success;
  readonly marcaNueva = this.formService.marcaNueva;

  ngOnInit(): void {
    this.formService.resetear();
    this.formService.cargarCatalogos();
  }

  onMarcaNuevaChange(event: Event): void {
    this.marcaNueva.set((event.target as HTMLInputElement).value);
  }

  onCodigoEscaneado(codigo: string): void {
    this.form.patchValue({ codigo_barras: codigo });
  }

  onEnviar(event: Event): void {
    event.preventDefault();

    this.formService.enviar().subscribe({
      next: (res) => {
        if (res) {
          this.formService.resetear();
          this.router.navigate(['/catalogo']);
        }
      },
    });
  }
}
