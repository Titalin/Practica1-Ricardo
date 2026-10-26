import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Division } from '../../../models/carrera.model';
import { mensajeDeError } from '../../../services/api.config';
import { AvisoService } from '../../../services/aviso.service';
import { DivisionService } from '../../../services/division.service';

@Component({
  selector: 'app-division-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './edit.html',
  styleUrls: ['../../index.css']
})
export class DivisionEditComponent implements OnInit {
  private readonly divisionService = inject(DivisionService);
  private readonly aviso = inject(AvisoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly division = signal<Division | null>(null);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal('');

  nombre = '';
  descripcion = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.divisionService.listar().subscribe({
      next: (divisiones) => {
        const division = divisiones.find((d) => d.id === id) ?? null;
        this.division.set(division);
        if (division) {
          this.nombre = division.nombre;
          this.descripcion = division.descripcion ?? '';
        } else {
          this.error.set('La división que intentas editar no existe.');
        }
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(mensajeDeError(err, 'No se pudo cargar la división.'));
        this.cargando.set(false);
      }
    });
  }

  guardar(): void {
    const division = this.division();
    if (!division) {
      return;
    }
    const nombre = this.nombre.trim();
    if (!nombre) {
      this.error.set('Escribe el nombre de la división.');
      return;
    }

    this.guardando.set(true);
    this.divisionService
      .actualizar(division.id, { nombre, descripcion: this.descripcion.trim() || null })
      .subscribe({
        next: (actualizada) => {
          this.aviso.publicar(`Se guardaron los cambios de "${actualizada.nombre}". Quedó pendiente de aprobación.`);
          this.router.navigateByUrl('/admin/division');
        },
        error: (err) => {
          this.guardando.set(false);
          this.error.set(mensajeDeError(err, 'No se pudieron guardar los cambios.'));
        }
      });
  }
}
