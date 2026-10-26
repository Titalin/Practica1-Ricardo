import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Carrera, Division, ETIQUETA_ESTADO } from '../../../models/carrera.model';
import { mensajeDeError } from '../../../services/api.config';
import { AvisoService } from '../../../services/aviso.service';
import { CarreraService } from '../../../services/carrera.service';
import { DivisionService } from '../../../services/division.service';

@Component({
  selector: 'app-carrera-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './edit.html',
  styleUrls: ['../../index.css', './carreras.css']
})
export class CarreraEditComponent implements OnInit {
  private readonly carreraService = inject(CarreraService);
  private readonly divisionService = inject(DivisionService);
  private readonly aviso = inject(AvisoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly carrera = signal<Carrera | null>(null);
  readonly divisiones = signal<Division[]>([]);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal('');

  nombre = '';
  descripcion = '';
  divisionId: number | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin({
      carreras: this.carreraService.listar(),
      divisiones: this.divisionService.listar()
    }).subscribe({
      next: ({ carreras, divisiones }) => {
        const carrera = carreras.find((c) => c.id === id) ?? null;
        this.divisiones.set(divisiones);
        this.carrera.set(carrera);
        if (carrera) {
          this.nombre = carrera.nombre;
          this.descripcion = carrera.descripcion ?? '';
          this.divisionId = carrera.divisionId;
        } else {
          this.error.set('La carrera que intentas editar no existe.');
        }
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(mensajeDeError(err, 'No se pudo cargar la carrera.'));
        this.cargando.set(false);
      }
    });
  }

  etiquetaDivision(d: Division): string {
    return d.estado === 'APROBADO' ? d.nombre : `${d.nombre} (${ETIQUETA_ESTADO[d.estado].toLowerCase()})`;
  }

  guardar(): void {
    const carrera = this.carrera();
    if (!carrera) {
      return;
    }
    const nombre = this.nombre.trim();
    if (!nombre) {
      this.error.set('Escribe el nombre de la carrera.');
      return;
    }
    if (this.divisionId === null) {
      this.error.set('Elige la división de la carrera.');
      return;
    }

    this.guardando.set(true);
    this.carreraService
      .actualizar(carrera.id, {
        nombre,
        descripcion: this.descripcion.trim() || null,
        divisionId: this.divisionId,
        visible: carrera.visible
      })
      .subscribe({
        next: (actualizada) => {
          this.aviso.publicar(`Se guardaron los cambios de "${actualizada.nombre}".`);
          this.router.navigateByUrl('/admin/carrera');
        },
        error: (err) => {
          this.guardando.set(false);
          this.error.set(mensajeDeError(err, 'No se pudieron guardar los cambios.'));
        }
      });
  }
}
