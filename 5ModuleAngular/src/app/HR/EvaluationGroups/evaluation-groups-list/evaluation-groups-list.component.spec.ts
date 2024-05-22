import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationGroupsListComponent } from './evaluation-groups-list.component';

describe('EvaluationGroupsListComponent', () => {
  let component: EvaluationGroupsListComponent;
  let fixture: ComponentFixture<EvaluationGroupsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationGroupsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
