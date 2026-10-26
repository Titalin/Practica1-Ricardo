import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Carrera, CarreraRequest } from '../models/carrera.model';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class CarreraService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/carreras`;

  listar(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.url);
  }

  crear(datos: CarreraRequest): Observable<Carrera> {
    return this.http.post<Carrera>(this.url, datos);
  }

  actualizar(id: number, datos: CarreraRequest): Observable<Carrera> {
    return this.http.put<Carrera>(`${this.url}/${id}`, datos);
  }

  cambiarVisibilidad(id: number, visible: boolean): Observable<Carrera> {
    return this.http.patch<Carrera>(`${this.url}/${id}/visibilidad`, { visible });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
