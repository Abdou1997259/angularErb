import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionTransListComponent } from './deduction-trans-list.component';

describe('DeductionTransListComponent', () => {
  let component: DeductionTransListComponent;
  let fixture: ComponentFixture<DeductionTransListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductionTransListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeductionTransListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
