import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBalanceListComponent } from './customer-balance-list.component';

describe('CustomerBalanceListComponent', () => {
  let component: CustomerBalanceListComponent;
  let fixture: ComponentFixture<CustomerBalanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerBalanceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerBalanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
