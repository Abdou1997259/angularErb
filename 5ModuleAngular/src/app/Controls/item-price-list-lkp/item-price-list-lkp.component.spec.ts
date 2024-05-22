import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPriceListLKPComponent } from './item-price-list-lkp.component';

describe('ItemPriceListLKPComponent', () => {
  let component: ItemPriceListLKPComponent;
  let fixture: ComponentFixture<ItemPriceListLKPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemPriceListLKPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemPriceListLKPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
