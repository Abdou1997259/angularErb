import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationGroupsComponent } from './evaluation-groups.component';

describe('EvaluationGroupsComponent', () => {
  let component: EvaluationGroupsComponent;
  let fixture: ComponentFixture<EvaluationGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationGroupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
