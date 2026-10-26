import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Division, ETIQUETA_ESTADO } from '../../../models/carrera.model';
import { mensajeDeError } from '../../../services/api.config';
import { AvisoService } from '../../../services/aviso.service';
import { DivisionService } from '../../../services/division.service';

@Component({
  selector: 'app-division-index',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './index.html',
  styleUrls: ['../../index.css']
})
export class DivisionIndexComponent implements OnInit {
  private readonly divisionService = inject(DivisionService);
  private readonly aviso = inject(AvisoService);

  readonly divisiones = signal<Division[]>([]);
  readonly cargando = signal(true);
  readonly mensaje = signal('');
  readonly error = signal('');

  readonly etiqueta = ETIQUETA_ESTADO;

  ngOnInit(): void {
    this.mensaje.set(this.aviso.tomar());

    this.divisionService.listar().subscribe({
      next: (divisiones) => {
        this.divisiones.set(divisiones);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(mensajeDeError(err, 'No se pudieron cargar las divisiones.'));
        this.cargando.set(false);
      }
    });
  }

  eliminar(division: Division): void {
    if (!confirm(`¿Seguro que quieres eliminar la división "${division.nombre}"?`)) {
      return;
    }
    this.divisionService.eliminar(division.id).subscribe({
      next: () => {
        this.divisiones.update((lista) => lista.filter((d) => d.id !== division.id));
        this.error.set('');
        this.mensaje.set(`Se eliminó "${division.nombre}".`);
      },
      error: (err) => {
        this.mensaje.set('');
        this.error.set(mensajeDeError(err, 'No se pudo eliminar la división.'));
      }
    });
  }
}
