import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './index.html',
  styleUrls: ['./index.css', './admin/index.css']
})
export class InicioComponent {}
