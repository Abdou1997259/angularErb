import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLkpComponent } from './employee-lkp.component';

describe('EmployeeLkpComponent', () => {
  let component: EmployeeLkpComponent;
  let fixture: ComponentFixture<EmployeeLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
