import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProceduresComponent } from './customer-procedures.component';

describe('CustomerProceduresComponent', () => {
  let component: CustomerProceduresComponent;
  let fixture: ComponentFixture<CustomerProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerProceduresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
