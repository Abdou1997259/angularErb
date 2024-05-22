import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsQuotationsComponent } from './items-quotations.component';

describe('ItemsLookUpComponent', () => {
  let component: ItemsQuotationsComponent;
  let fixture: ComponentFixture<ItemsQuotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsQuotationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
