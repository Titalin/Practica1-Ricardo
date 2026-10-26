import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Division, ETIQUETA_ESTADO } from '../../../models/carrera.model';
import { mensajeDeError } from '../../../services/api.config';
import { AvisoService } from '../../../services/aviso.service';
import { CarreraService } from '../../../services/carrera.service';
import { DivisionService } from '../../../services/division.service';

@Component({
  selector: 'app-carrera-agregar',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './agregar.html',
  styleUrls: ['../../index.css', './carreras.css']
})
export class CarreraAgregarComponent implements OnInit {
  private readonly carreraService = inject(CarreraService);
  private readonly divisionService = inject(DivisionService);
  private readonly aviso = inject(AvisoService);
  private readonly router = inject(Router);

  readonly divisiones = signal<Division[]>([]);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal('');

  nombre = '';
  descripcion = '';
  divisionId: number | null = null;

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

  etiquetaDivision(d: Division): string {
    return d.estado === 'APROBADO' ? d.nombre : `${d.nombre} (${ETIQUETA_ESTADO[d.estado].toLowerCase()})`;
  }

  guardar(): void {
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
      .crear({ nombre, descripcion: this.descripcion.trim() || null, divisionId: this.divisionId })
      .subscribe({
        next: (carrera) => {
          this.aviso.publicar(`Se agregó "${carrera.nombre}".`);
          this.router.navigateByUrl('/admin/carrera');
        },
        error: (err) => {
          this.guardando.set(false);
          this.error.set(mensajeDeError(err, 'No se pudo agregar la carrera.'));
        }
      });
  }
}
