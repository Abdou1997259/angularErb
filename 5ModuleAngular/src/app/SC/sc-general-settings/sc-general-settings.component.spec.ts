import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScGeneralSettingsComponent } from './sc-general-settings.component';

describe('ScGeneralSettingsComponent', () => {
  let component: ScGeneralSettingsComponent;
  let fixture: ComponentFixture<ScGeneralSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScGeneralSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScGeneralSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
