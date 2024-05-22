import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseDemandComponent } from './purchase-demand.component';

describe('PurchaseDemandComponent', () => {
  let component: PurchaseDemandComponent;
  let fixture: ComponentFixture<PurchaseDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseDemandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
