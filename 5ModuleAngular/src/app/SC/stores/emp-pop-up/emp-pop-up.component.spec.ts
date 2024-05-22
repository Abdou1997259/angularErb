import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpPopUpComponent } from './emp-pop-up.component';

describe('EmpPopUpComponent', () => {
  let component: EmpPopUpComponent;
  let fixture: ComponentFixture<EmpPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
