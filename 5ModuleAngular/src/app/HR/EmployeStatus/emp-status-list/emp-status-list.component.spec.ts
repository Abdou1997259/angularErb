import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpStatusListComponent } from './emp-status-list.component';

describe('EmpStatusListComponent', () => {
  let component: EmpStatusListComponent;
  let fixture: ComponentFixture<EmpStatusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpStatusListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
