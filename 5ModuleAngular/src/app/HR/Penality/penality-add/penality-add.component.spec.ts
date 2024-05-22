import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenalityAddComponent } from './penality-add.component';

describe('PenalityAddComponent', () => {
  let component: PenalityAddComponent;
  let fixture: ComponentFixture<PenalityAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PenalityAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenalityAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
