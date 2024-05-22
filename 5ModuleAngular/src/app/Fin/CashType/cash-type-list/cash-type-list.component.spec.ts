import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTypeListComponent } from './cash-type-list.component';

describe('CashTypeListComponent', () => {
  let component: CashTypeListComponent;
  let fixture: ComponentFixture<CashTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashTypeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
