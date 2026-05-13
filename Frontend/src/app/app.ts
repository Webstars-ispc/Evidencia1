import { Component } from '@angular/core';
import { Header } from './shared/components/header/header';
import { Hero } from './features/hero/hero';
import { Footer } from './shared/components/footer/footer';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Header, Hero, Footer, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
