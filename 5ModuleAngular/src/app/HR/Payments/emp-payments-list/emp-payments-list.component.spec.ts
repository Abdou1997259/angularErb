import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpPaymentsListComponent } from './emp-payments-list.component';

describe('EmpPaymentsListComponent', () => {
  let component: EmpPaymentsListComponent;
  let fixture: ComponentFixture<EmpPaymentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpPaymentsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
