import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCostcentersLkpComponent } from './purchase-costcenters-lkp.component';

describe('PurchaseCostcentersLkpComponent', () => {
  let component: PurchaseCostcentersLkpComponent;
  let fixture: ComponentFixture<PurchaseCostcentersLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseCostcentersLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseCostcentersLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
