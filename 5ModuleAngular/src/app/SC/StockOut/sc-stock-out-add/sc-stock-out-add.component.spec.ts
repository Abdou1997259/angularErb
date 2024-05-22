import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScStockOutAddComponent } from './sc-stock-out-add.component';

describe('ScStockOutAddComponent', () => {
  let component: ScStockOutAddComponent;
  let fixture: ComponentFixture<ScStockOutAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScStockOutAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScStockOutAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
