import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrConfigurationComponent } from './hr-configuration.component';

describe('HrConfigurationComponent', () => {
  let component: HrConfigurationComponent;
  let fixture: ComponentFixture<HrConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
