import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpClassListComponent } from './emp-class-list.component';

describe('EmpClassListComponent', () => {
  let component: EmpClassListComponent;
  let fixture: ComponentFixture<EmpClassListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpClassListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpClassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
