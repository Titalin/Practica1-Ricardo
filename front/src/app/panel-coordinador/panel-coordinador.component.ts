import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Carrera, Division } from '../models/carrera.model';
import { CarreraService } from '../services/carrera.service';
import { DivisionService } from '../services/division.service';
import { mensajeDeError } from '../services/api.config';

@Component({
  selector: 'app-panel-coordinador',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './panel-coordinador.component.html',
  styleUrl: './panel-coordinador.component.css'
})
export class PanelCoordinadorComponent implements OnInit {
  private readonly carreraService = inject(CarreraService);
  private readonly divisionService = inject(DivisionService);
  private readonly router = inject(Router);

  // Datos que vienen del backend
  readonly carreras = signal<Carrera[]>([]);
  readonly divisiones = signal<Division[]>([]);

  // Estado de la pantalla
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly mensaje = signal('');
  readonly error = signal('');
  readonly editando = signal<Carrera | null>(null);

  // Formulario "Agregar carrera"
  nuevoNombre = '';
  nuevaDivisionId: number | null = null;

  // Formulario "Editar carrera"
  editNombre = '';
  editDivisionId: number | null = null;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    forkJoin({
      carreras: this.carreraService.listar(),
      divisiones: this.divisionService.listar()
    }).subscribe({
      next: ({ carreras, divisiones }) => {
        this.carreras.set(carreras);
        this.divisiones.set(divisiones);
        this.cargando.set(false);
      },
      error: (err) => {
        this.fallo(mensajeDeError(err, 'No se pudieron cargar los datos.'));
        this.cargando.set(false);
      }
    });
  }

  etiquetaDivision(d: Division): string {
    return d.estado === 'APROBADO' ? d.nombre : `${d.nombre} (${d.estado.toLowerCase()})`;
  }

  // ---------- Agregar ----------
  agregar(): void {
    const nombre = this.nuevoNombre.trim();
    if (!nombre) {
      this.fallo('Escribe el nombre de la carrera.');
      return;
    }
    if (this.nuevaDivisionId === null) {
      this.fallo('Elige la división de la carrera.');
      return;
    }

    this.guardando.set(true);
    this.carreraService.crear({ nombre, divisionId: this.nuevaDivisionId }).subscribe({
      next: (carrera) => {
        this.carreras.update((lista) => [...lista, carrera]);
        this.nuevoNombre = '';
        this.guardando.set(false);
        this.ok(`Se agregó "${carrera.nombre}".`);
      },
      error: (err) => {
        this.guardando.set(false);
        this.fallo(mensajeDeError(err, 'No se pudo agregar la carrera.'));
      }
    });
  }

  // ---------- Editar ----------
  iniciarEdicion(carrera: Carrera): void {
    this.editando.set(carrera);
    this.editNombre = carrera.nombre;
    this.editDivisionId = carrera.divisionId;
    this.limpiarAvisos();
  }

  cancelarEdicion(): void {
    this.editando.set(null);
    this.limpiarAvisos();
  }

  guardarEdicion(): void {
    const carrera = this.editando();
    if (!carrera) {
      return;
    }
    const nombre = this.editNombre.trim();
    if (!nombre) {
      this.fallo('Escribe el nuevo nombre de la carrera.');
      return;
    }
    if (this.editDivisionId === null) {
      this.fallo('Elige la división de la carrera.');
      return;
    }

    this.guardando.set(true);
    this.carreraService
      .actualizar(carrera.id, {
        nombre,
        descripcion: carrera.descripcion,
        divisionId: this.editDivisionId,
        visible: carrera.visible
      })
      .subscribe({
        next: (actualizada) => {
          this.reemplazar(actualizada);
          this.editando.set(null);
          this.guardando.set(false);
          this.ok(`Se guardaron los cambios de "${actualizada.nombre}".`);
        },
        error: (err) => {
          this.guardando.set(false);
          this.fallo(mensajeDeError(err, 'No se pudieron guardar los cambios.'));
        }
      });
  }

  // ---------- Eliminar ----------
  eliminar(carrera: Carrera): void {
    if (!confirm(`¿Seguro que quieres eliminar "${carrera.nombre}"?`)) {
      return;
    }

    this.carreraService.eliminar(carrera.id).subscribe({
      next: () => {
        this.carreras.update((lista) => lista.filter((c) => c.id !== carrera.id));
        if (this.editando()?.id === carrera.id) {
          this.editando.set(null);
        }
        this.ok(`Se eliminó "${carrera.nombre}".`);
      },
      error: (err) => this.fallo(mensajeDeError(err, 'No se pudo eliminar la carrera.'))
    });
  }

  // ---------- Ocultar / mostrar en inicio ----------
  alternarVisibilidad(carrera: Carrera): void {
    const visible = !carrera.visible;
    this.carreraService.cambiarVisibilidad(carrera.id, visible).subscribe({
      next: (actualizada) => {
        this.reemplazar(actualizada);
        this.ok(
          visible
            ? `"${actualizada.nombre}" ahora se muestra en el inicio.`
            : `"${actualizada.nombre}" ya no se muestra en el inicio.`
        );
      },
      error: (err) => this.fallo(mensajeDeError(err, 'No se pudo cambiar la visibilidad.'))
    });
  }

  // ---------- Opciones ----------
  volverAlInicio(): void {
    this.router.navigateByUrl('/');
  }

  cerrarSesion(): void {
    // El backend aún no tiene login: aquí solo se limpia lo guardado en el navegador.
    sessionStorage.clear();
    this.router.navigateByUrl('/');
  }

  // ---------- Utilidades ----------
  private reemplazar(actualizada: Carrera): void {
    this.carreras.update((lista) => lista.map((c) => (c.id === actualizada.id ? actualizada : c)));
  }

  private ok(texto: string): void {
    this.error.set('');
    this.mensaje.set(texto);
  }

  private fallo(texto: string): void {
    this.mensaje.set('');
    this.error.set(texto);
  }

  private limpiarAvisos(): void {
    this.mensaje.set('');
    this.error.set('');
  }
}
