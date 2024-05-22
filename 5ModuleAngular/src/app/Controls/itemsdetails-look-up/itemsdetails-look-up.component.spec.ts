import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsdetailsLookUpComponent } from './itemsdetails-look-up.component';

describe('ItemsdetailsLookUpComponent', () => {
  let component: ItemsdetailsLookUpComponent;
  let fixture: ComponentFixture<ItemsdetailsLookUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsdetailsLookUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsdetailsLookUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
