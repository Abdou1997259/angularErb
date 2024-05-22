import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsDetailsSalesReturnsComponent } from './items-details-sales-returns.component';

describe('ItemsDetailsSalesReturnsComponent', () => {
  let component: ItemsDetailsSalesReturnsComponent;
  let fixture: ComponentFixture<ItemsDetailsSalesReturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsDetailsSalesReturnsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsDetailsSalesReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
