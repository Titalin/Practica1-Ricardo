import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Division, ETIQUETA_ESTADO, EstadoAprobacion } from '../../models/carrera.model';
import { mensajeDeError } from '../../services/api.config';
import { AprobacionService } from '../../services/aprobacion.service';
import { DivisionService } from '../../services/division.service';

@Component({
  selector: 'app-secretario-index',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './index.html',
  styleUrls: ['../index.css']
})
export class SecretarioIndexComponent implements OnInit {
  private readonly divisionService = inject(DivisionService);
  private readonly aprobacionService = inject(AprobacionService);

  readonly divisiones = signal<Division[]>([]);
  readonly cargando = signal(true);
  readonly mensaje = signal('');
  readonly error = signal('');

  readonly pendientes = computed(() => this.divisiones().filter((d) => d.estado === 'PENDIENTE'));
  readonly revisadas = computed(() => this.divisiones().filter((d) => d.estado !== 'PENDIENTE'));

  readonly etiqueta = ETIQUETA_ESTADO;

  ngOnInit(): void {
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

  cambiarEstado(division: Division, estado: EstadoAprobacion): void {
    this.aprobacionService.cambiarEstado(division.id, estado).subscribe({
      next: (actualizada) => {
        this.divisiones.update((lista) => lista.map((d) => (d.id === actualizada.id ? actualizada : d)));
        this.error.set('');
        this.mensaje.set(`"${actualizada.nombre}": ${ETIQUETA_ESTADO[estado].toLowerCase()}.`);
      },
      error: (err) => {
        this.mensaje.set('');
        this.error.set(mensajeDeError(err, 'No se pudo cambiar el estado.'));
      }
    });
  }
}
