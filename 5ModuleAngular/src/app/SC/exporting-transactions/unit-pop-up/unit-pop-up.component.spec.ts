import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitPopUpComponent } from './unit-pop-up.component';

describe('UnitPopUpComponent', () => {
  let component: UnitPopUpComponent;
  let fixture: ComponentFixture<UnitPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
