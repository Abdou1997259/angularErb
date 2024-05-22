import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerQuotationAddComponent } from './customer-quotation-add.component';

describe('CustomerQuotationAddComponent', () => {
  let component: CustomerQuotationAddComponent;
  let fixture: ComponentFixture<CustomerQuotationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerQuotationAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerQuotationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
