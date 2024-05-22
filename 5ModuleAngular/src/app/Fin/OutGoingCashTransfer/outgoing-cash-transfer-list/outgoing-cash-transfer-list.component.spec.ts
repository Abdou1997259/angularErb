import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingCashTransferListComponent } from './outgoing-cash-transfer-list.component';

describe('OutgoingCashTransferListComponent', () => {
  let component: OutgoingCashTransferListComponent;
  let fixture: ComponentFixture<OutgoingCashTransferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutgoingCashTransferListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingCashTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
