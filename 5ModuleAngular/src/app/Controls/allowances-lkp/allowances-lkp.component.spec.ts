import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowancesLkpComponent } from './allowances-lkp.component';

describe('AllowancesLkpComponent', () => {
  let component: AllowancesLkpComponent;
  let fixture: ComponentFixture<AllowancesLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllowancesLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllowancesLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
