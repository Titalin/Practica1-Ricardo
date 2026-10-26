import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { PanelCoordinadorComponent } from './panel-coordinador.component';

const API = 'http://localhost:8080/api';

describe('PanelCoordinadorComponent', () => {
  let component: PanelCoordinadorComponent;
  let fixture: ComponentFixture<PanelCoordinadorComponent>;
  let http: HttpTestingController;

  const carrera = (visible: boolean) => ({
    id: 1, nombre: 'Mecatrónica', descripcion: null, visible,
    divisionId: 10, divisionNombre: 'Tecnologías'
  });
  const division = { id: 10, nombre: 'Tecnologías', descripcion: null, estado: 'APROBADO', carreras: [] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelCoordinadorComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PanelCoordinadorComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    http.expectOne(`${API}/carreras`).flush([carrera(true)]);
    http.expectOne(`${API}/divisiones`).flush([division]);
    fixture.detectChanges();
  });

  it('should create y listar las carreras del backend', () => {
    expect(component).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Mecatrónica');
  });

  it('alterna la visibilidad llamando al backend', () => {
    component.alternarVisibilidad(component.carreras()[0]);

    const req = http.expectOne(`${API}/carreras/1/visibilidad`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ visible: false });
    req.flush(carrera(false));

    expect(component.carreras()[0].visible).toBeFalse();
  });

  it('no agrega una carrera sin nombre', () => {
    component.nuevoNombre = '   ';
    component.nuevaDivisionId = 10;
    component.agregar();

    http.expectNone(`${API}/carreras`);
    expect(component.error()).toContain('nombre');
  });
});
