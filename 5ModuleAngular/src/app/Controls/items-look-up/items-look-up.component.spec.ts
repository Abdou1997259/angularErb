import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsLookUpComponent } from './items-look-up.component';

describe('ItemsLookUpComponent', () => {
  let component: ItemsLookUpComponent;
  let fixture: ComponentFixture<ItemsLookUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsLookUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsLookUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
