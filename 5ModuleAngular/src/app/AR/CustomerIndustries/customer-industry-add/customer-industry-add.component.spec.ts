import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerIndustryAddComponent } from './customer-industry-add.component';

describe('CustomerIndustryAddComponent', () => {
  let component: CustomerIndustryAddComponent;
  let fixture: ComponentFixture<CustomerIndustryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerIndustryAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerIndustryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
