import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpClassGroupComponent } from './emp-class-group.component';

describe('EmpClassGroupComponent', () => {
  let component: EmpClassGroupComponent;
  let fixture: ComponentFixture<EmpClassGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpClassGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpClassGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
