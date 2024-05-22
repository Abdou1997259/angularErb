import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBalanceAddComponent } from './customer-balance-add.component';

describe('CustomerBalanceAddComponent', () => {
  let component: CustomerBalanceAddComponent;
  let fixture: ComponentFixture<CustomerBalanceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerBalanceAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerBalanceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
