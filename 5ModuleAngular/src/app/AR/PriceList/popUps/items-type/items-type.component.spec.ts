import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsTypeComponent } from './items-type.component';

describe('ItemsTypeComponent', () => {
  let component: ItemsTypeComponent;
  let fixture: ComponentFixture<ItemsTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
