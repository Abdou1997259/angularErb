import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashCodeAddComponent } from './cash-code-add.component';

describe('CashCodeAddComponent', () => {
  let component: CashCodeAddComponent;
  let fixture: ComponentFixture<CashCodeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashCodeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashCodeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
