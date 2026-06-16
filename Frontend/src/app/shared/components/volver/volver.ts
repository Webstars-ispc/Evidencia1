import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-volver',
  imports: [],
  templateUrl: './volver.html',
  styleUrl: './volver.css'
})
export class Volver {
  constructor(private location: Location) {}

  volver(): void {
    this.location.back();
  }
}