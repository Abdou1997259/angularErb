import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScStockInAddComponent } from './sc-stock-in-add.component';

describe('ScStockInAddComponent', () => {
  let component: ScStockInAddComponent;
  let fixture: ComponentFixture<ScStockInAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScStockInAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScStockInAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
