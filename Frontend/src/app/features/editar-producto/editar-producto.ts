import { Component, OnInit, inject, computed, input, effect } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductoFormService } from '../../services/producto-form.service';
import { Volver } from '../../shared/components/volver/volver';

@Component({
  selector: 'app-editar-producto',
  imports: [ReactiveFormsModule, Volver],
  templateUrl: './editar-producto.html',
  styleUrl: './editar-producto.css',
})
export class EditarProducto implements OnInit {
  private readonly formService = inject(ProductoFormService);
  private readonly router = inject(Router);

  readonly id = input.required<number>();

  readonly form = this.formService.form;
  readonly rubros = this.formService.rubros;
  readonly marcas = this.formService.marcas;
  readonly cargandoCatalogos = this.formService.cargandoCatalogos;
  readonly cargandoProducto = this.formService.cargandoProducto;
  readonly enviando = this.formService.enviando;
  readonly error = this.formService.error;
  readonly success = this.formService.success;
  readonly marcaNueva = this.formService.marcaNueva;

  readonly cargando = computed(
    () => this.cargandoCatalogos() || this.cargandoProducto()
  );

  private readonly _catalogosListos = effect(() => {
    if (!this.cargandoCatalogos()) {
      this.formService.cargarProducto(this.id());
      this._catalogosListos.destroy();
    }
  });

  ngOnInit(): void {
    this.formService.resetear();
    this.formService.cargarCatalogos();
  }

  onMarcaNuevaChange(event: Event): void {
    this.marcaNueva.set((event.target as HTMLInputElement).value);
  }

  onEnviar(event: Event): void {
    event.preventDefault();
    this.formService.enviar(this.id()).subscribe({
      next: (res) => {
        if (res) {
          this.router.navigate(['/catalogo']);
        }
      },
    });
  }

  onCancelar(): void {
    this.router.navigate(['/catalogo']);
  }
}
