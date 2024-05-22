import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArShiftAddComponent } from './ar-shift-add.component';

describe('ArShiftAddComponent', () => {
  let component: ArShiftAddComponent;
  let fixture: ComponentFixture<ArShiftAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArShiftAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArShiftAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
