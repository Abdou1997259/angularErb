import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerIndustryListComponent } from './customer-industry-list.component';

describe('CustomerIndustryListComponent', () => {
  let component: CustomerIndustryListComponent;
  let fixture: ComponentFixture<CustomerIndustryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerIndustryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerIndustryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
