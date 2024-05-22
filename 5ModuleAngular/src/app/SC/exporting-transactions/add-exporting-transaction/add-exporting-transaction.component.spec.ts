import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExportingTransactionComponent } from './add-exporting-transaction.component';

describe('AddExportingTransactionComponent', () => {
  let component: AddExportingTransactionComponent;
  let fixture: ComponentFixture<AddExportingTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExportingTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExportingTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
