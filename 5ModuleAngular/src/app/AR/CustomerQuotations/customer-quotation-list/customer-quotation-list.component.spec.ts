import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerQuotationListComponent } from './customer-quotation-list.component';

describe('CustomerQuotationListComponent', () => {
  let component: CustomerQuotationListComponent;
  let fixture: ComponentFixture<CustomerQuotationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerQuotationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerQuotationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
