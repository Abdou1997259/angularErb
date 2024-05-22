import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSalesOrderAddComponent } from './customer-sales-order-add.component';

describe('CustomerSalesOrderAddComponent', () => {
  let component: CustomerSalesOrderAddComponent;
  let fixture: ComponentFixture<CustomerSalesOrderAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSalesOrderAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSalesOrderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
