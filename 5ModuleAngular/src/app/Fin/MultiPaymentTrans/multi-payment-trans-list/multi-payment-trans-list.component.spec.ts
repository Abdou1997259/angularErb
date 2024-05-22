import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPaymentTransListComponent } from './multi-payment-trans-list.component';

describe('MultiPaymentTransListComponent', () => {
  let component: MultiPaymentTransListComponent;
  let fixture: ComponentFixture<MultiPaymentTransListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiPaymentTransListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiPaymentTransListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
