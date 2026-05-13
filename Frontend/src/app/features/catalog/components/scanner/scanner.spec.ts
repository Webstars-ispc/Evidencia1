import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scanner } from './scanner';

describe('Scanner', () => {
  let component: Scanner;
  let fixture: ComponentFixture<Scanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scanner],
    }).compileComponents();

    fixture = TestBed.createComponent(Scanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
