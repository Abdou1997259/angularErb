import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionAllownaceComponent } from './deduction-allownace.component';

describe('DeductionAllownaceComponent', () => {
  let component: DeductionAllownaceComponent;
  let fixture: ComponentFixture<DeductionAllownaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductionAllownaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeductionAllownaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
