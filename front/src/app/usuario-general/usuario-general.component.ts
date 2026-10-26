import { Component, OnInit, inject, signal } from '@angular/core';

import { Division } from '../models/carrera.model';
import { DivisionService } from '../services/division.service';
import { mensajeDeError } from '../services/api.config';

@Component({
  selector: 'app-usuario-general',
  standalone: true,
  imports: [],
  templateUrl: './usuario-general.component.html',
  styleUrl: './usuario-general.component.css'
})
export class UsuarioGeneralComponent implements OnInit {
  private readonly divisionService = inject(DivisionService);

  readonly divisiones = signal<Division[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.divisionService.listarParaInicio().subscribe({
      next: (divisiones) => {
        this.divisiones.set(divisiones);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(mensajeDeError(err, 'No se pudieron cargar las carreras.'));
        this.cargando.set(false);
      }
    });
  }
}
