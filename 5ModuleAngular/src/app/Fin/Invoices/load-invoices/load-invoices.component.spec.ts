import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadInvoicesComponent } from './load-invoices.component';

describe('LoadInvoicesComponent', () => {
  let component: LoadInvoicesComponent;
  let fixture: ComponentFixture<LoadInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadInvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
