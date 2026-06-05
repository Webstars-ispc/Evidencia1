import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-modal',

  templateUrl: './delete-modal.html',
  styleUrl: './delete-modal.css',
})
export class DeleteModal {
  cantidad = input.required<number>();
  confirmar = output<void>();
  cancelar = output<void>();

  onConfirmar() {
    this.confirmar.emit();
  }

  onCancelar() {
    this.cancelar.emit();
  }
}
