import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsSalesorderLkpComponent } from './items-salesorder-lkp.component';

describe('ItemsSalesorderLkpComponent', () => {
  let component: ItemsSalesorderLkpComponent;
  let fixture: ComponentFixture<ItemsSalesorderLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsSalesorderLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsSalesorderLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
