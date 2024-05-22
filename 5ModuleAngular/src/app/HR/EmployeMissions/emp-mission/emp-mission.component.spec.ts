import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpMissionComponent } from './emp-mission.component';

describe('EmpMissionComponent', () => {
  let component: EmpMissionComponent;
  let fixture: ComponentFixture<EmpMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpMissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
