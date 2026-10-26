import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Division, DivisionRequest } from '../models/carrera.model';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class DivisionService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/divisiones`;

  /** Todas las divisiones, sin importar su estado (admin y secretario). */
  listar(): Observable<Division[]> {
    return this.http.get<Division[]>(this.url);
  }

  /** Divisiones aprobadas con sus carreras visibles (usuario). */
  listarParaInicio(): Observable<Division[]> {
    return this.http.get<Division[]>(`${this.url}/inicio`);
  }

  crear(datos: DivisionRequest): Observable<Division> {
    return this.http.post<Division>(this.url, datos);
  }

  actualizar(id: number, datos: DivisionRequest): Observable<Division> {
    return this.http.put<Division>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
