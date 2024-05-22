import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportingTransactionsComponent } from './importing-transactions.component';

describe('ImportingTransactionsComponent', () => {
  let component: ImportingTransactionsComponent;
  let fixture: ComponentFixture<ImportingTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportingTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportingTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
