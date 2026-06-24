import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { Volver } from '../../shared/components/volver/volver';

@Component({
  selector: 'app-gestionar-equipo',
  imports: [CommonModule, ReactiveFormsModule, Volver],
  templateUrl: './equipo.html',
  styleUrls: ['./equipo.css']
})
export class GestionarEquipo implements OnInit {
  usuarios: any[] = [];
  mostrandoForm = false;
  editando = false;
  usuarioEditandoId: number | null = null;
  errorMessage = '';
  successMessage = '';
  enviando = false;
  form: FormGroup;
  mostrandoModalEliminar = false;
  usuarioAEliminar: any = null;

  columnas = [
    { key: 'id', label: 'ID', hideMobile: true },
    { key: 'username', label: 'Usuario', hideMobile: false },
    { key: 'email', label: 'Email', hideMobile: true },
    { key: 'role', label: 'Rol', hideMobile: false },
    { key: 'acciones', label: 'Acciones', hideMobile: false },
];

  constructor(
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Empleado', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuariosService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.errorMessage = 'Error al cargar usuarios. ¿Estás logueado como administrador?';
      }
    });
  }

  mostrarFormulario(): void {
    this.mostrandoForm = true;
    this.editando = false;
    this.usuarioEditandoId = null;
    this.errorMessage = '';
    this.successMessage = '';
    // Reiniciar el formulario con valores por defecto y validadores iniciales (contraseña requerida)
    this.form.reset({ role: 'Empleado' });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
  }

  editarUsuario(user: any): void {
    this.mostrandoForm = true;
    this.editando = true;
    this.usuarioEditandoId = user.id;
    this.errorMessage = '';
    this.successMessage = '';

    // Primero limpiar validadores de contraseña para que no sea obligatoria
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();

    // Luego establecer los valores (así evitamos que se active required en el seteo)
    this.form.setValue({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role
    });
  }

  cancelar(): void {
    this.mostrandoForm = false;
    this.editando = false;
    this.usuarioEditandoId = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.reset({ role: 'Empleado' });
  }

  guardarUsuario(event: Event): void {
    event.preventDefault();
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
        this.form.markAllAsTouched();
        if (this.editando) {
            this.errorMessage = 'No se pudo actualizar el usuario. Completá todos los campos correctamente.';
        } else {
            this.errorMessage = 'No se pudo crear el usuario. Completá todos los campos correctamente.';
        }
        return;
    }

    this.enviando = true;
    const formData = { ...this.form.value };

    if (this.editando && !formData.password) {
        delete formData.password;
    }

    if (this.editando && this.usuarioEditandoId) {
        this.usuariosService.actualizar(this.usuarioEditandoId, formData).subscribe({
            next: () => {
                this.successMessage = 'Usuario actualizado correctamente.';
                this.enviando = false;
                this.cdr.detectChanges(); // Forzar actualización de la vista
                setTimeout(() => {
                    this.cancelar();
                    this.cargarUsuarios();
                }, 1000);
            },
            error: (err) => {
                this.errorMessage = err.error?.detail || 'Error al actualizar usuario. Complete los campos correctamente.';
                this.enviando = false;
                this.cdr.detectChanges();
            }
        });
    } else {
      this.usuariosService.crear(formData).subscribe({
          next: () => {
              this.successMessage = 'Usuario creado correctamente.';
              this.enviando = false;
              this.cdr.detectChanges();
              setTimeout(() => {
                  this.cancelar();
                  this.cargarUsuarios();
              }, 1000);
          },
          error: (err) => {
              this.errorMessage = err.error?.detail || 'Error al crear usuario.';
              this.enviando = false;
              this.cdr.detectChanges();
          }
      });
    }
  }

  eliminarUsuario(user: any): void {
  this.usuarioAEliminar = user;
  this.mostrandoModalEliminar = true;
  }

  confirmarEliminacion(): void {
    if (!this.usuarioAEliminar) return;
    this.mostrandoModalEliminar = false;
    
    this.usuariosService.eliminar(this.usuarioAEliminar.id).subscribe({
      next: () => {
        this.successMessage = 'Usuario eliminado.';
        this.cargarUsuarios();
      },
      error: (err) => {
        this.errorMessage = err.error?.detail || 'Error al eliminar usuario.';
      }
    });
  }

  cancelarEliminacion(): void {
    this.mostrandoModalEliminar = false;
    this.usuarioAEliminar = null;
  }

  get usernameError(): string {
    const c = this.form.get('username');
    if (c?.touched && c?.errors?.['required']) return 'El nombre de usuario es obligatorio.';
    return '';
  }

  get emailError(): string {
    const c = this.form.get('email');
    if (c?.touched && c?.errors?.['required']) return 'El email es obligatorio.';
    if (c?.touched && c?.errors?.['email']) return 'El formato del email no es válido.';
    return '';
  }

  get passwordError(): string {
    const c = this.form.get('password');
    if (c?.touched && c?.errors?.['required']) return 'La contraseña es obligatoria.';
    if (c?.touched && c?.errors?.['minlength']) return 'La contraseña debe tener al menos 6 caracteres.';
    return '';
  }
}