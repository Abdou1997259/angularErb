import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpClassComponent } from './emp-class.component';

describe('EmpClassComponent', () => {
  let component: EmpClassComponent;
  let fixture: ComponentFixture<EmpClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpClassComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
