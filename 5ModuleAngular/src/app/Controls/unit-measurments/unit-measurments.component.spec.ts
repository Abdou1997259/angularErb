import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitMeasurmentsComponent } from './unit-measurments.component';

describe('UnitMeasurmentsComponent', () => {
  let component: UnitMeasurmentsComponent;
  let fixture: ComponentFixture<UnitMeasurmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitMeasurmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitMeasurmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
