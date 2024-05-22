import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpClassGroupListComponent } from './emp-class-group-list.component';

describe('EmpClassGroupListComponent', () => {
  let component: EmpClassGroupListComponent;
  let fixture: ComponentFixture<EmpClassGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpClassGroupListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpClassGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
