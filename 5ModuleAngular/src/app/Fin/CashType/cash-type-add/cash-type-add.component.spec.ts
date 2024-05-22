import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTypeAddComponent } from './cash-type-add.component';

describe('CashTypeAddComponent', () => {
  let component: CashTypeAddComponent;
  let fixture: ComponentFixture<CashTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashTypeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
