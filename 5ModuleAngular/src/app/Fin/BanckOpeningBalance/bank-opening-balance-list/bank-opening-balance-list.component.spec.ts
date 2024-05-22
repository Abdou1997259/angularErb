import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankOpeningBalanceListComponent } from './bank-opening-balance-list.component';

describe('BankOpeningBalanceListComponent', () => {
  let component: BankOpeningBalanceListComponent;
  let fixture: ComponentFixture<BankOpeningBalanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankOpeningBalanceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankOpeningBalanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
