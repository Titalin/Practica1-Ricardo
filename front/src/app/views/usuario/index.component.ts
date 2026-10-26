import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Division } from '../../models/carrera.model';
import { mensajeDeError } from '../../services/api.config';
import { DivisionService } from '../../services/division.service';

@Component({
  selector: 'app-usuario-index',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './index.html',
  styleUrls: ['../index.css']
})
export class UsuarioIndexComponent implements OnInit {
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
