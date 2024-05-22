import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustodyExchangeListComponent } from './custody-exchange-list.component';

describe('CustodyExchangeListComponent', () => {
  let component: CustodyExchangeListComponent;
  let fixture: ComponentFixture<CustodyExchangeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustodyExchangeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustodyExchangeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
