import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddImportingTransactionComponent } from './add-importing-transaction.component';

describe('AddImportingTransactionComponent', () => {
  let component: AddImportingTransactionComponent;
  let fixture: ComponentFixture<AddImportingTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddImportingTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddImportingTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
