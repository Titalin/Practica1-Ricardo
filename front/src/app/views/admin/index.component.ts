import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-index',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './index.html',
  styleUrls: ['../index.css', './index.css']
})
export class AdminIndexComponent {}
