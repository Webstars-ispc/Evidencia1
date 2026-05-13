import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interceptors } from './interceptors';

describe('Interceptors', () => {
  let component: Interceptors;
  let fixture: ComponentFixture<Interceptors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Interceptors],
    }).compileComponents();

    fixture = TestBed.createComponent(Interceptors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
