import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeWorkListComponent } from './resume-work-list.component';

describe('ResumeWorkListComponent', () => {
  let component: ResumeWorkListComponent;
  let fixture: ComponentFixture<ResumeWorkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeWorkListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeWorkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
