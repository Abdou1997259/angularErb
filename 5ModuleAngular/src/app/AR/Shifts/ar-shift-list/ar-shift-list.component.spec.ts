import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArShiftListComponent } from './ar-shift-list.component';

describe('ArShiftListComponent', () => {
  let component: ArShiftListComponent;
  let fixture: ComponentFixture<ArShiftListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArShiftListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArShiftListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
