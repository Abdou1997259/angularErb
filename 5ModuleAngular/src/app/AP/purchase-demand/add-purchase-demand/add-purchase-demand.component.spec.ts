import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPurchaseDemandComponent } from './add-purchase-demand.component';

describe('AddPurchaseDemandComponent', () => {
  let component: AddPurchaseDemandComponent;
  let fixture: ComponentFixture<AddPurchaseDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPurchaseDemandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPurchaseDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
