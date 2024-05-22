import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsalesLookupComponent } from './itemsales-lookup.component';

describe('ItemsalesLookupComponent', () => {
  let component: ItemsalesLookupComponent;
  let fixture: ComponentFixture<ItemsalesLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsalesLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsalesLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
