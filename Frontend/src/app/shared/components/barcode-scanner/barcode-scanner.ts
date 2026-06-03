import {
  Component,
  ElementRef,
  OnDestroy,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-barcode-scanner',
  template: `
    <button
      type="button"
      class="barcode-trigger"
      [class.barcode-trigger--compact]="compact()"
      (click)="abrir()"
      [disabled]="mostrar()"
      [title]="label()"
    >
      <span class="barcode-trigger-icon">📱</span>
      <span class="barcode-trigger-text">{{ label() }}</span>
    </button>

    @if (mostrar()) {
      <div class="barcode-overlay" (click)="cerrar()">
        <div class="barcode-modal" (click)="$event.stopPropagation()">
          <div class="barcode-modal-header">
            <h2>Escanear Código de Barras</h2>
            <button
              type="button"
              class="barcode-close"
              (click)="cerrar()"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div class="barcode-modal-body">
            <div class="barcode-video-wrapper">
              <video
                #video
                class="barcode-video"
                autoplay
                muted
                playsinline
              ></video>

              @if (mostrarReticle()) {
                <div class="barcode-reticle" aria-hidden="true">
                  <span class="barcode-reticle-corner barcode-reticle-corner--tl"></span>
                  <span class="barcode-reticle-corner barcode-reticle-corner--tr"></span>
                  <span class="barcode-reticle-corner barcode-reticle-corner--bl"></span>
                  <span class="barcode-reticle-corner barcode-reticle-corner--br"></span>
                  <span class="barcode-reticle-line"></span>
                </div>
              }
            </div>

            @if (iniciando()) {
              <div class="barcode-status">
                <span class="barcode-status-icon">📹</span>
                <span>Inicializando cámara...</span>
              </div>
            } @else if (!error()) {
              <div class="barcode-status">
                <span class="barcode-status-icon">📹</span>
                <span>Apuntá el código de barras dentro del recuadro</span>
              </div>
            }

            @if (error()) {
              <div class="barcode-alert barcode-alert--danger">
                <span class="barcode-alert-icon">⚠️</span>
                <span>{{ error() }}</span>
              </div>
            }
          </div>

          <div class="barcode-modal-footer">
            <button type="button" class="barcode-cancel" (click)="cerrar()">
              <span>✕</span> Cancelar
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    /* Botón trigger */
    .barcode-trigger {
      background: #E1C582 !important;
      border: 1px solid #284574 !important;
      border-radius: 4px;
      color: #1C2E5D !important;
      padding: 10px 16px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Raleway', sans-serif;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .barcode-trigger:hover:not(:disabled) {
      background: #D2A047 !important;
      transform: translateY(-1px);
    }

    .barcode-trigger:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .barcode-trigger--compact {
      padding: 8px 12px;
      font-size: 1rem;
    }

    .barcode-trigger--compact .barcode-trigger-text {
      display: none;
    }

    /* Overlay */
    .barcode-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.92);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
      padding: 16px;
      animation: barcode-fade-in 0.2s ease;
    }

    @keyframes barcode-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Modal */
    .barcode-modal {
      background: #1C2E5D;
      border: 1px solid #284574;
      border-radius: 8px;
      width: min(95vw, 1100px);
      max-width: 1100px;
      max-height: 95vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
      animation: barcode-slide-up 0.25s ease;
    }

    @keyframes barcode-slide-up {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    /* Header */
    .barcode-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 32px;
      border-bottom: 1px solid #284574;
      color: #E1C582;
      font-family: 'Playfair Display', serif;
      flex-shrink: 0;
    }

    .barcode-modal-header h2 {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 500;
    }

    .barcode-close {
      background: none;
      border: none;
      color: #E1C582;
      font-size: 1.8rem;
      cursor: pointer;
      padding: 0;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .barcode-close:hover {
      color: #D2A047;
      background: rgba(225, 197, 130, 0.1);
    }

    /* Body */
    .barcode-modal-body {
      padding: 28px 32px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow-y: auto;
    }

    /* Video wrapper */
    .barcode-video-wrapper {
      position: relative;
      width: 100%;
      background: #000;
      border-radius: 6px;
      overflow: hidden;
      aspect-ratio: 16 / 9;
      min-height: 320px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    }

    .barcode-video {
      width: 100%;
      height: 100%;
      background: #000;
      object-fit: cover;
      display: block;
    }

    /* Reticle */
    .barcode-reticle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 75%;
      max-width: 640px;
      height: 55%;
      min-height: 120px;
      pointer-events: none;
    }

    .barcode-reticle-corner {
      position: absolute;
      width: 32px;
      height: 32px;
      border: 3px solid #E1C582;
      filter: drop-shadow(0 0 6px rgba(225, 197, 130, 0.5));
    }

    .barcode-reticle-corner--tl {
      top: 0;
      left: 0;
      border-right: none;
      border-bottom: none;
      border-top-left-radius: 4px;
    }

    .barcode-reticle-corner--tr {
      top: 0;
      right: 0;
      border-left: none;
      border-bottom: none;
      border-top-right-radius: 4px;
    }

    .barcode-reticle-corner--bl {
      bottom: 0;
      left: 0;
      border-right: none;
      border-top: none;
      border-bottom-left-radius: 4px;
    }

    .barcode-reticle-corner--br {
      bottom: 0;
      right: 0;
      border-left: none;
      border-top: none;
      border-bottom-right-radius: 4px;
    }

    /* Animated scan line */
    .barcode-reticle-line {
      position: absolute;
      top: 0;
      left: 8px;
      right: 8px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #E1C582 20%, #E1C582 80%, transparent);
      box-shadow: 0 0 10px rgba(225, 197, 130, 0.7);
      animation: barcode-scan 2.2s ease-in-out infinite;
    }

    @keyframes barcode-scan {
      0%, 100% { top: 0; }
      50% { top: calc(100% - 2px); }
    }

    /* Status / info */
    .barcode-status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      text-align: center;
      color: #E1C582;
      font-family: 'Raleway', sans-serif;
      font-size: 1rem;
      margin: 0;
      padding: 14px 20px;
      background: rgba(225, 197, 130, 0.08);
      border-radius: 6px;
      border: 1px solid rgba(225, 197, 130, 0.2);
    }

    .barcode-status-icon {
      font-size: 1.2rem;
    }

    /* Alert */
    .barcode-alert {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Raleway', sans-serif;
      font-size: 0.95rem;
      border-radius: 6px;
      padding: 16px 20px;
    }

    .barcode-alert--danger {
      background: rgba(220, 38, 38, 0.12);
      border: 1px solid rgba(220, 38, 38, 0.35);
      color: #fca5a5;
    }

    .barcode-alert-icon {
      font-size: 1.4rem;
      flex-shrink: 0;
    }

    /* Footer */
    .barcode-modal-footer {
      display: flex;
      gap: 12px;
      padding: 20px 32px;
      border-top: 1px solid #284574;
      flex-shrink: 0;
    }

    .barcode-cancel {
      flex: 1;
      background: #284574 !important;
      border: 1px solid #284574 !important;
      color: #E1C582 !important;
      padding: 14px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      font-family: 'Raleway', sans-serif;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .barcode-cancel:hover {
      background: #1C2E5D !important;
      border-color: #E1C582 !important;
    }

    .barcode-cancel span {
      font-size: 1.1rem;
      line-height: 1;
    }

    /* Mobile */
    @media (max-width: 575.98px) {
      .barcode-overlay {
        padding: 0;
        align-items: stretch;
      }

      .barcode-modal {
        max-width: none;
        max-height: 100vh;
        height: 100vh;
        border-radius: 0;
      }

      .barcode-modal-header {
        padding: 18px 20px;
      }

      .barcode-modal-header h2 {
        font-size: 1.2rem;
      }

      .barcode-modal-body {
        padding: 20px;
        gap: 20px;
      }

      .barcode-video-wrapper {
        min-height: 320px;
      }

      .barcode-reticle {
        height: 32%;
        min-height: 90px;
      }

      .barcode-modal-footer {
        padding: 16px 20px;
      }

      .barcode-cancel {
        padding: 16px 20px;
        font-size: 0.85rem;
      }
    }
  `,
})
export class BarcodeScanner implements OnDestroy {
  readonly label = input<string>('Escanear');
  readonly compact = input<boolean>(false);
  readonly codigoEscaneado = output<string>();

  readonly mostrar = signal(false);
  readonly error = signal<string | null>(null);
  readonly iniciando = signal(false);
  readonly mostrarReticle = computed(
    () => this.mostrar() && !this.error() && !this.iniciando()
  );

  readonly videoElement = viewChild<ElementRef<HTMLVideoElement>>('video');

  private codeReader: any = null;
  private streamActivo: MediaStream | null = null;

  abrir(): void {
    if (this.mostrar()) return;
    this.error.set(null);
    this.mostrar.set(true);
    this.iniciando.set(true);
    setTimeout(() => this.iniciar(), 150);
  }

  cerrar(): void {
    this.detener();
  }

  ngOnDestroy(): void {
    this.detener();
  }

  private async iniciar(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.error.set(
        'Tu navegador no soporta el escáner de cámara. Ingresá el código manualmente.'
      );
      this.iniciando.set(false);
      return;
    }

    const video = this.videoElement()?.nativeElement;
    if (!video) {
      this.error.set('No se encontró el elemento de video.');
      this.iniciando.set(false);
      return;
    }

    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      this.codeReader = new BrowserMultiFormatReader();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });

      this.streamActivo = stream;
      video.muted = true;
      video.setAttribute('playsinline', 'true');
      video.srcObject = stream;
      if (video.paused) {
        await video.play();
      }
      this.iniciando.set(false);

      this.codeReader.decodeFromVideoElement(video, (result: any) => {
        if (!result) return;
        const codigo = String(result.getText() ?? '').trim();
        if (!codigo) return;
        this.codigoEscaneado.emit(codigo);
        this.detener();
      });
    } catch (err: any) {
      console.error('[BarcodeScanner] Error:', err);
      this.iniciando.set(false);
      this.error.set(this.traducirError(err));
    }
  }

  private detener(): void {
    if (this.streamActivo) {
      this.streamActivo.getTracks().forEach((track) => track.stop());
      this.streamActivo = null;
    }
    const video = this.videoElement()?.nativeElement;
    if (video) {
      video.srcObject = null;
    }
      if (this.codeReader) {
        try { this.codeReader.reset(); } catch {}
      }
      this.codeReader = null;
    this.mostrar.set(false);
    this.iniciando.set(false);
    this.error.set(null);
  }

  private traducirError(err: any): string {
    if (!err) return 'No se pudo iniciar la cámara.';
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      return 'Permiso de cámara denegado. Habilítalo en la configuración del navegador.';
    }
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      return 'No se encontró ninguna cámara en el dispositivo.';
    }
    if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      return 'La cámara está siendo usada por otra aplicación.';
    }
    if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
      return 'No se encontró una cámara que cumpla los requisitos.';
    }
    if (err.name === 'AbortError') {
      return 'La inicialización de la cámara fue cancelada.';
    }
    return 'No se pudo iniciar la cámara. Intentá de nuevo.';
  }
}
