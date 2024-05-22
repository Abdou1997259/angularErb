import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseManComponent } from './purchase-man.component';

describe('PurchaseManComponent', () => {
  let component: PurchaseManComponent;
  let fixture: ComponentFixture<PurchaseManComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseManComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseManComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
