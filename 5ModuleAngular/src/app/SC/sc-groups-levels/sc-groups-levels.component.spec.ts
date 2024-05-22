import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScGroupsLevelsComponent } from './sc-groups-levels.component';

describe('ScGroupsLevelsComponent', () => {
  let component: ScGroupsLevelsComponent;
  let fixture: ComponentFixture<ScGroupsLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScGroupsLevelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScGroupsLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
