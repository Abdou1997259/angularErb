import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPaymentTransAddComponent } from './multi-payment-trans-add.component';

describe('MultiPaymentTransAddComponent', () => {
  let component: MultiPaymentTransAddComponent;
  let fixture: ComponentFixture<MultiPaymentTransAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiPaymentTransAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiPaymentTransAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
