import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsPopUpComponent } from './items-pop-up.component';

describe('ItemsPopUpComponent', () => {
  let component: ItemsPopUpComponent;
  let fixture: ComponentFixture<ItemsPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
