import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { BrowserMultiFormatReader } from '@zxing/browser';

@Component({
  selector: 'app-registro-producto',
  imports: [ReactiveFormsModule, CommonModule, NgIf],
  templateUrl: './cargar-producto.html',
  styleUrl: './cargar-producto.css'
})
export class CargarProducto implements OnInit {
  form: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  mostrarScanner = false;
  leyendoCodigoBarras = false;
  videoRotation = 0;

  @ViewChild('video', { static: false }) videoElement: ElementRef | undefined;

  private codeReader: BrowserMultiFormatReader | null = null;
  private scannerActivo = false;

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductoService
  ) {
    this.form = this.formBuilder.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        descripcion: [''],
        codigo_barras: ['', [Validators.pattern(/^[0-9]{8,13}$/)]], // Ejemplo: 8 a 13 dígitos numéricos
        precio_costo: ['', [Validators.required, Validators.min(0.01)]], // Mínimo 0.01 para evitar 0
        precio_venta: ['', [Validators.required, Validators.min(0.01)]],
        stock: [0, [Validators.required, Validators.min(0)]],
        rubro: ['', [Validators.required]],
        marca: ['']
      }
    );
  }

  get nombre(): AbstractControl | null { return this.form.get('nombre'); }
  get descripcion(): AbstractControl | null { return this.form.get('descripcion'); }
  get codigo_barras(): AbstractControl | null { return this.form.get('codigo_barras'); }
  get precio_costo(): AbstractControl | null { return this.form.get('precio_costo'); }
  get precio_venta(): AbstractControl | null { return this.form.get('precio_venta'); }
  get stock(): AbstractControl | null { return this.form.get('stock'); }
  get rubro(): AbstractControl | null { return this.form.get('rubro'); }
  get marca(): AbstractControl | null { return this.form.get('marca'); }

  ngOnInit(): void {
  }

  onEscanear(): void {
    this.videoRotation = 0;
    this.mostrarScanner = true;
    this.leyendoCodigoBarras = true;

    setTimeout(() => {
      this.iniciarScanner();
    }, 100);
  }

  toggleRotacionVideo(): void {
    this.videoRotation = this.videoRotation === 0 ? 180 : 0;
  }

  private iniciarScanner(): void {
    console.log('[Scanner] iniciarScanner()');

    if (this.scannerActivo) {
      console.log('[Scanner] iniciarScanner() ignorado: scannerActivo=true');
      return;
    }

    this.scannerActivo = true;
    this.cerrarScanner();
    this.codeReader = new BrowserMultiFormatReader();

    const video = (this.videoElement?.nativeElement || document.getElementById('video-scanner')) as HTMLVideoElement | null;
    console.log('[Scanner] video encontrado:', !!video);

    if (!video) {
      console.error('[Scanner] No se encontró el elemento de video');
      this.cerrarScanner();
      return;
    }

    try {
      video.muted = true;
      video.setAttribute('playsinline', 'true');
      video.style.transform = `rotate(${this.videoRotation}deg) scaleX(1)`;

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' }
        },
        audio: false
      };

      console.log('[Scanner] getUserMedia()');

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          console.log('[Scanner] Stream obtenido');
          video.srcObject = stream;
          return video.play();
        })
        .then(() => {
          console.log('[Scanner] decodeFromVideoElement()');

          this.codeReader?.decodeFromVideoElement(video, (result) => {
            if (!result) {
              return;
            }

            console.log('[Scanner] ✅ Código leído:', result.getText());
            this.form.patchValue({ codigo_barras: result.getText() });
            this.cerrarScanner();
          });
        })
        .catch((err) => {
          console.error('[Scanner] Error getUserMedia/decode:', err);
          this.cerrarScanner();
        });
    } catch (err) {
      console.error('[Scanner] Error inesperado:', err);
      this.cerrarScanner();
    }
  }

  private detenerStreams(): void {
    const video = (this.videoElement?.nativeElement || document.getElementById('video-scanner')) as HTMLVideoElement | null;
    if (video && video.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  }

  cerrarScanner(): void {
    console.log('[Scanner] cerrarScanner()');

    this.detenerStreams();

    if (this.codeReader) {
      this.codeReader = null;
    }

    this.mostrarScanner = false;
    this.leyendoCodigoBarras = false;
    this.videoRotation = 0;
    this.scannerActivo = false;
  }

  onEnviar(event: Event): void {
    event.preventDefault(); 

    this.successMessage = null;
    this.errorMessage = null; 

    if (this.form.valid) {
      const nuevoProducto = this.form.value;
      nuevoProducto.rubro = nuevoProducto.rubro ? parseInt(nuevoProducto.rubro, 10) : null;
      if (nuevoProducto.marca && nuevoProducto.marca !== '') {
        nuevoProducto.marca = parseInt(nuevoProducto.marca, 10);
      } else {
        nuevoProducto.marca = null;
      }
      nuevoProducto.precio_costo = parseFloat(nuevoProducto.precio_costo);
      nuevoProducto.precio_venta = parseFloat(nuevoProducto.precio_venta);
      nuevoProducto.stock = parseInt(nuevoProducto.stock, 10);

      this.productoService.guardarProducto(nuevoProducto).subscribe({
        next: (response: any) => {
          console.log('¡Producto guardado!', response);
          this.successMessage = 'Producto guardado correctamente.';
          this.form.reset({ stock: 0, rubro: '', marca: '' });
        },
        error: (error: any) => {
          console.error('Error al guardar:', error);
          alert('Error al guardar. Asegúrate de que los IDs de rubro y marca existan en Django.');
        }
      });
    }
    else {
      this.form.markAllAsTouched();
      this.errorMessage = 'Por favor, corrige los errores del formulario.';
    }
  }
}
