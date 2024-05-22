import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustodyCodesComponent } from './custody-codes.component';

describe('CustodyCodesComponent', () => {
  let component: CustodyCodesComponent;
  let fixture: ComponentFixture<CustodyCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustodyCodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustodyCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
