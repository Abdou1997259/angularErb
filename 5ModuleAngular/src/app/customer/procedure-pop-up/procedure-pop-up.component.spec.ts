import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedurePopUpComponent } from './procedure-pop-up.component';

describe('ProcedurePopUpComponent', () => {
  let component: ProcedurePopUpComponent;
  let fixture: ComponentFixture<ProcedurePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcedurePopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcedurePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
