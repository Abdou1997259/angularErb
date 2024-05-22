import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialMultiCashTransAddComponent } from './financial-multi-cash-trans-add.component';

describe('FinancialMultiCashTransAddComponent', () => {
  let component: FinancialMultiCashTransAddComponent;
  let fixture: ComponentFixture<FinancialMultiCashTransAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialMultiCashTransAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialMultiCashTransAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
