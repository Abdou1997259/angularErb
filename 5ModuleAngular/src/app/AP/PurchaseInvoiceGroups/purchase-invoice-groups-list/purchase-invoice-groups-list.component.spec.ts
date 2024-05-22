import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInvoiceGroupsListComponent } from './purchase-invoice-groups-list.component';

describe('PurchaseInvoiceGroupsListComponent', () => {
  let component: PurchaseInvoiceGroupsListComponent;
  let fixture: ComponentFixture<PurchaseInvoiceGroupsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseInvoiceGroupsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseInvoiceGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
