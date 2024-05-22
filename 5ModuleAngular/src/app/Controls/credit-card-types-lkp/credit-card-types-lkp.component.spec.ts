import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardTypesLkpComponent } from './credit-card-types-lkp.component';

describe('CreditCardTypesLkpComponent', () => {
  let component: CreditCardTypesLkpComponent;
  let fixture: ComponentFixture<CreditCardTypesLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardTypesLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardTypesLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
