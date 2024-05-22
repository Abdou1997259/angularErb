import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScStockOutListComponent } from './sc-stock-out-list.component';

describe('ScStockOutListComponent', () => {
  let component: ScStockOutListComponent;
  let fixture: ComponentFixture<ScStockOutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScStockOutListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScStockOutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
