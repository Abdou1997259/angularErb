import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustodyExchangeComponent } from './custody-exchange.component';

describe('CustodyExchangeComponent', () => {
  let component: CustodyExchangeComponent;
  let fixture: ComponentFixture<CustodyExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustodyExchangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustodyExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
