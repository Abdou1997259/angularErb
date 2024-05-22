import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReturnsListComponent } from './purchase-returns-list.component';

describe('PurchaseReturnsListComponent', () => {
  let component: PurchaseReturnsListComponent;
  let fixture: ComponentFixture<PurchaseReturnsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseReturnsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseReturnsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
