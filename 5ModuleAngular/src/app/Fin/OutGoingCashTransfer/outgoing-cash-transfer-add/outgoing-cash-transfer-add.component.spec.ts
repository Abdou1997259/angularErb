import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingCashTransferAddComponent } from './outgoing-cash-transfer-add.component';

describe('OutgoingCashTransferAddComponent', () => {
  let component: OutgoingCashTransferAddComponent;
  let fixture: ComponentFixture<OutgoingCashTransferAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutgoingCashTransferAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingCashTransferAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
