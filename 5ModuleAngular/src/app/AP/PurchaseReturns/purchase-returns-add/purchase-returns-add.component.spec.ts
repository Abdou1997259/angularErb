import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReturnsAddComponent } from './purchase-returns-add.component';

describe('PurchaseReturnsAddComponent', () => {
  let component: PurchaseReturnsAddComponent;
  let fixture: ComponentFixture<PurchaseReturnsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseReturnsAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseReturnsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
