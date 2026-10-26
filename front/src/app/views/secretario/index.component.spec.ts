import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { SecretarioIndexComponent } from './index.component';

const API = 'http://localhost:8080/api';

describe('SecretarioIndexComponent', () => {
  let fixture: ComponentFixture<SecretarioIndexComponent>;
  let component: SecretarioIndexComponent;
  let http: HttpTestingController;

  const division = (estado: string) => ({ id: 3, nombre: 'Ambiental', descripcion: null, estado, carreras: [] });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretarioIndexComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SecretarioIndexComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne(`${API}/divisiones`).flush([division('PENDIENTE')]);
  });

  it('separa pendientes de revisadas y aprueba llamando al backend', () => {
    expect(component.pendientes().length).toBe(1);

    component.cambiarEstado(component.pendientes()[0], 'APROBADO');
    const req = http.expectOne(`${API}/aprobaciones/divisiones/3`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ estado: 'APROBADO' });
    req.flush(division('APROBADO'));

    expect(component.pendientes().length).toBe(0);
    expect(component.revisadas().length).toBe(1);
  });
});
