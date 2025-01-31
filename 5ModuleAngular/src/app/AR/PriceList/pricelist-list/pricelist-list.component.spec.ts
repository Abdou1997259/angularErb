import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricelistListComponent } from './pricelist-list.component';

describe('PricelistListComponent', () => {
  let component: PricelistListComponent;
  let fixture: ComponentFixture<PricelistListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricelistListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricelistListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
