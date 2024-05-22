import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionTransComponent } from './deduction-trans.component';

describe('DeductionTransComponent', () => {
  let component: DeductionTransComponent;
  let fixture: ComponentFixture<DeductionTransComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductionTransComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeductionTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
