import { Component } from '@angular/core';
import { Header } from './header/header';
import { Hero } from './hero/hero';
import { Info } from './info/info';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header, Hero, Info, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}