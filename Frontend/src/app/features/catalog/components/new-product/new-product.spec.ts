import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProduct } from './new-product';

describe('NewProduct', () => {
  let component: NewProduct;
  let fixture: ComponentFixture<NewProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProduct],
    }).compileComponents();

    fixture = TestBed.createComponent(NewProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
