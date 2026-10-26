import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Carrera } from '../../../models/carrera.model';
import { mensajeDeError } from '../../../services/api.config';
import { AvisoService } from '../../../services/aviso.service';
import { CarreraService } from '../../../services/carrera.service';

@Component({
  selector: 'app-carrera-index',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './index.html',
  styleUrls: ['../../index.css', './carreras.css']
})
export class CarreraIndexComponent implements OnInit {
  private readonly carreraService = inject(CarreraService);
  private readonly aviso = inject(AvisoService);

  readonly carreras = signal<Carrera[]>([]);
  readonly cargando = signal(true);
  readonly mensaje = signal('');
  readonly error = signal('');

  ngOnInit(): void {
    this.mensaje.set(this.aviso.tomar());

    this.carreraService.listar().subscribe({
      next: (carreras) => {
        this.carreras.set(carreras);
        this.cargando.set(false);
      },
      error: (err) => {
        this.fallo(mensajeDeError(err, 'No se pudieron cargar las carreras.'));
        this.cargando.set(false);
      }
    });
  }

  eliminar(carrera: Carrera): void {
    if (!confirm(`¿Seguro que quieres eliminar "${carrera.nombre}"?`)) {
      return;
    }
    this.carreraService.eliminar(carrera.id).subscribe({
      next: () => {
        this.carreras.update((lista) => lista.filter((c) => c.id !== carrera.id));
        this.ok(`Se eliminó "${carrera.nombre}".`);
      },
      error: (err) => this.fallo(mensajeDeError(err, 'No se pudo eliminar la carrera.'))
    });
  }

  alternarVisibilidad(carrera: Carrera): void {
    const visible = !carrera.visible;
    this.carreraService.cambiarVisibilidad(carrera.id, visible).subscribe({
      next: (actualizada) => {
        this.carreras.update((lista) => lista.map((c) => (c.id === actualizada.id ? actualizada : c)));
        this.ok(
          visible
            ? `"${actualizada.nombre}" ahora se muestra en el inicio.`
            : `"${actualizada.nombre}" ya no se muestra en el inicio.`
        );
      },
      error: (err) => this.fallo(mensajeDeError(err, 'No se pudo cambiar la visibilidad.'))
    });
  }

  private ok(texto: string): void {
    this.error.set('');
    this.mensaje.set(texto);
  }

  private fallo(texto: string): void {
    this.mensaje.set('');
    this.error.set(texto);
  }
}
