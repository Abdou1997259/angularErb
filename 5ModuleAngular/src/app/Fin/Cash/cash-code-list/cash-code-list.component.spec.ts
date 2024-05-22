import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashCodeListComponent } from './cash-code-list.component';

describe('CashCodeListComponent', () => {
  let component: CashCodeListComponent;
  let fixture: ComponentFixture<CashCodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashCodeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
