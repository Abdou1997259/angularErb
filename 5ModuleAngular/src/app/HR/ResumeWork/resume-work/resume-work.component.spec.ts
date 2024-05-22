import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeWorkComponent } from './resume-work.component';

describe('ResumeWorkComponent', () => {
  let component: ResumeWorkComponent;
  let fixture: ComponentFixture<ResumeWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
