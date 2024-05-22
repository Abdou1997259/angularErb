import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsRecieveComponent } from './items-recieve.component';

describe('ItemsRecieveComponent', () => {
  let component: ItemsRecieveComponent;
  let fixture: ComponentFixture<ItemsRecieveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsRecieveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsRecieveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
