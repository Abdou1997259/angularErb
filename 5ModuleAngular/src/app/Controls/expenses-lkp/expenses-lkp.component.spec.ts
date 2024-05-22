import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesLkpComponent } from './expenses-lkp.component';

describe('ExpensesLkpComponent', () => {
  let component: ExpensesLkpComponent;
  let fixture: ComponentFixture<ExpensesLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensesLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
