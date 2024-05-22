import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGeneralPopupComponent } from './item-general-popup.component';

describe('ItemGeneralPopupComponent', () => {
  let component: ItemGeneralPopupComponent;
  let fixture: ComponentFixture<ItemGeneralPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemGeneralPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemGeneralPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
