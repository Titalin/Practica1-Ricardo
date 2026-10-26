import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Division, EstadoAprobacion } from '../models/carrera.model';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class AprobacionService {
  private readonly http = inject(HttpClient);

  cambiarEstado(divisionId: number, estado: EstadoAprobacion): Observable<Division> {
    return this.http.patch<Division>(`${API_URL}/aprobaciones/divisiones/${divisionId}`, { estado });
  }
}
