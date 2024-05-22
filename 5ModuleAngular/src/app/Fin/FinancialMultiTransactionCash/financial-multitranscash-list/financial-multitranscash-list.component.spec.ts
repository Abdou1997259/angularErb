import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialMultitranscashListComponent } from './financial-multitranscash-list.component';

describe('FinancialMultitranscashListComponent', () => {
  let component: FinancialMultitranscashListComponent;
  let fixture: ComponentFixture<FinancialMultitranscashListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialMultitranscashListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialMultitranscashListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
