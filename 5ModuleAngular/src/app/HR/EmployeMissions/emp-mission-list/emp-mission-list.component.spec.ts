import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpMissionListComponent } from './emp-mission-list.component';

describe('EmpMissionListComponent', () => {
  let component: EmpMissionListComponent;
  let fixture: ComponentFixture<EmpMissionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpMissionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpMissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
