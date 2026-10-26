import { Routes } from '@angular/router';

import { InicioComponent } from './views/index.component';
import { AdminIndexComponent } from './views/admin/index.component';
import { CarreraIndexComponent } from './views/admin/carrera/index.component';
import { CarreraAgregarComponent } from './views/admin/carrera/agregar.component';
import { CarreraEditComponent } from './views/admin/carrera/edit.component';
import { DivisionIndexComponent } from './views/admin/division/index.component';
import { DivisionAgregarComponent } from './views/admin/division/agregar.component';
import { DivisionEditComponent } from './views/admin/division/edit.component';
import { SecretarioIndexComponent } from './views/secretario/index.component';
import { UsuarioIndexComponent } from './views/usuario/index.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },

  { path: 'usuario', component: UsuarioIndexComponent },
  { path: 'secretario', component: SecretarioIndexComponent },

  { path: 'admin', component: AdminIndexComponent },
  { path: 'admin/carrera', component: CarreraIndexComponent },
  { path: 'admin/carrera/agregar', component: CarreraAgregarComponent },
  { path: 'admin/carrera/editar/:id', component: CarreraEditComponent },
  { path: 'admin/division', component: DivisionIndexComponent },
  { path: 'admin/division/agregar', component: DivisionAgregarComponent },
  { path: 'admin/division/editar/:id', component: DivisionEditComponent },

  { path: '**', redirectTo: '' }
];
