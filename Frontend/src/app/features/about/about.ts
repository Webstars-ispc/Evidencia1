import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent {
  equipo = [
    { nombre: 'Anabella Lujan Medrano', rol: 'Scrum Master', inicial: 'A' },
    { nombre: 'Claudia Del Pilar Farias', rol: 'Desarrollador', inicial: 'C' },
    { nombre: 'Franco Agustin Trivini De Ejalde', rol: 'Desarrollador', inicial: 'F' },
    { nombre: 'Gabriel Agustin Pavon Molina', rol: 'Desarrollador', inicial: 'G' },
    { nombre: 'Jesica Analia Aramayo', rol: 'Desarrollador', inicial: 'J' },
    { nombre: 'Sofia Gimena Ledesma', rol: 'Desarrollador', inicial: 'S' }    
  ];
}