import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { CarreraIndexComponent } from './index.component';

const API = 'http://localhost:8080/api';

describe('CarreraIndexComponent', () => {
  let fixture: ComponentFixture<CarreraIndexComponent>;
  let component: CarreraIndexComponent;
  let http: HttpTestingController;

  const carrera = (visible: boolean) => ({
    id: 1, nombre: 'Mecatrónica', descripcion: null, visible, divisionId: 10, divisionNombre: 'Tecnologías'
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarreraIndexComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CarreraIndexComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne(`${API}/carreras`).flush([carrera(true)]);
    fixture.detectChanges();
  });

  it('lista las carreras del backend', () => {
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Mecatrónica');
  });

  it('oculta una carrera del inicio', () => {
    component.alternarVisibilidad(component.carreras()[0]);
    const req = http.expectOne(`${API}/carreras/1/visibilidad`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ visible: false });
    req.flush(carrera(false));
    expect(component.carreras()[0].visible).toBeFalse();
  });
});
