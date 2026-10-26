import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { mensajeDeError } from '../../../services/api.config';
import { AvisoService } from '../../../services/aviso.service';
import { DivisionService } from '../../../services/division.service';

@Component({
  selector: 'app-division-agregar',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './agregar.html',
  styleUrls: ['../../index.css']
})
export class DivisionAgregarComponent {
  private readonly divisionService = inject(DivisionService);
  private readonly aviso = inject(AvisoService);
  private readonly router = inject(Router);

  readonly guardando = signal(false);
  readonly error = signal('');

  nombre = '';
  descripcion = '';

  guardar(): void {
    const nombre = this.nombre.trim();
    if (!nombre) {
      this.error.set('Escribe el nombre de la división.');
      return;
    }

    this.guardando.set(true);
    this.divisionService.crear({ nombre, descripcion: this.descripcion.trim() || null }).subscribe({
      next: (division) => {
        this.aviso.publicar(`Se agregó "${division.nombre}". Queda pendiente de aprobación.`);
        this.router.navigateByUrl('/admin/division');
      },
      error: (err) => {
        this.guardando.set(false);
        this.error.set(mensajeDeError(err, 'No se pudo agregar la división.'));
      }
    });
  }
}
