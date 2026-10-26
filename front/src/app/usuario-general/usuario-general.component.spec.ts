import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { UsuarioGeneralComponent } from './usuario-general.component';

describe('UsuarioGeneralComponent', () => {
  let component: UsuarioGeneralComponent;
  let fixture: ComponentFixture<UsuarioGeneralComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioGeneralComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioGeneralComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    http.expectOne('http://localhost:8080/api/divisiones/inicio').flush([]);
    expect(component).toBeTruthy();
  });

  it('muestra las divisiones y carreras que manda el backend', () => {
    http.expectOne('http://localhost:8080/api/divisiones/inicio').flush([
      {
        id: 1, nombre: 'Industrial', descripcion: null, estado: 'APROBADO',
        carreras: [{ id: 5, nombre: 'Ingeniería Industrial', descripcion: null,
                     visible: true, divisionId: 1, divisionNombre: 'Industrial' }]
      }
    ]);
    fixture.detectChanges();

    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('Industrial');
    expect(texto).toContain('Ingeniería Industrial');
  });
});
