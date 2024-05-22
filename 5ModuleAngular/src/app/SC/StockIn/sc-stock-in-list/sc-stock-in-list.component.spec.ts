import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScStockInListComponent } from './sc-stock-in-list.component';

describe('ScStockInListComponent', () => {
  let component: ScStockInListComponent;
  let fixture: ComponentFixture<ScStockInListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScStockInListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScStockInListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
