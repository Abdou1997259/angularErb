import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankOpeningBalanceAddComponent } from './bank-opening-balance-add.component';

describe('BankOpeningBalanceAddComponent', () => {
  let component: BankOpeningBalanceAddComponent;
  let fixture: ComponentFixture<BankOpeningBalanceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankOpeningBalanceAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankOpeningBalanceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
