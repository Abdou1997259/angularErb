import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobLkpComponent } from './job-lkp.component';

describe('JobLkpComponent', () => {
  let component: JobLkpComponent;
  let fixture: ComponentFixture<JobLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
