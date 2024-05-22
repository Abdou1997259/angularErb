import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTransAddComponent } from './payment-trans-add.component';

describe('PaymentTransAddComponent', () => {
  let component: PaymentTransAddComponent;
  let fixture: ComponentFixture<PaymentTransAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTransAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTransAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
