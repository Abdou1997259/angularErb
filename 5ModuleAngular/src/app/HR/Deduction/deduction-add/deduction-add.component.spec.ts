import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionAddComponent } from './deduction-add.component';

describe('DeductionAddComponent', () => {
  let component: DeductionAddComponent;
  let fixture: ComponentFixture<DeductionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductionAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeductionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
