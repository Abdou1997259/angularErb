import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorLKPComponent } from './calculator-lkp.component';

describe('CalculatorLKPComponent', () => {
  let component: CalculatorLKPComponent;
  let fixture: ComponentFixture<CalculatorLKPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorLKPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorLKPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
