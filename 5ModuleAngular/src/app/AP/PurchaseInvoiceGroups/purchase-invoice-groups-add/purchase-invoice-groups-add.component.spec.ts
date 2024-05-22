import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInvoiceGroupsAddComponent } from './purchase-invoice-groups-add.component';

describe('PurchaseInvoiceGroupsAddComponent', () => {
  let component: PurchaseInvoiceGroupsAddComponent;
  let fixture: ComponentFixture<PurchaseInvoiceGroupsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseInvoiceGroupsAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseInvoiceGroupsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
