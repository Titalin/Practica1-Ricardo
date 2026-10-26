import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AvisoService {
  private readonly texto = signal('');

  publicar(mensaje: string): void {
    this.texto.set(mensaje);
  }

  /** Devuelve el aviso pendiente (si hay) y lo borra para que se muestre una sola vez. */
  tomar(): string {
    const mensaje = this.texto();
    this.texto.set('');
    return mensaje;
  }
}
