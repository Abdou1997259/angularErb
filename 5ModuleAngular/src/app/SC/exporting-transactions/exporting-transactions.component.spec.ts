import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportingTransactionsComponent } from './exporting-transactions.component';

describe('ExportingTransactionsComponent', () => {
  let component: ExportingTransactionsComponent;
  let fixture: ComponentFixture<ExportingTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportingTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportingTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
