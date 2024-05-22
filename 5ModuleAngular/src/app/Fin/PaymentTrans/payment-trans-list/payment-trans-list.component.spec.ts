import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTransListComponent } from './payment-trans-list.component';

describe('PaymentTransListComponent', () => {
  let component: PaymentTransListComponent;
  let fixture: ComponentFixture<PaymentTransListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTransListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTransListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
