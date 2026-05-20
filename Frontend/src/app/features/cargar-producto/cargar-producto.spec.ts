import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarProducto } from './cargar-producto';

describe('CargarProducto', () => {
  let component: CargarProducto;
  let fixture: ComponentFixture<CargarProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargarProducto],
    }).compileComponents();

    fixture = TestBed.createComponent(CargarProducto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
