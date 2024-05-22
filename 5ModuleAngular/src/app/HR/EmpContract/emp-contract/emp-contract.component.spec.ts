import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpContractComponent } from './emp-contract.component';

describe('EmpContractComponent', () => {
  let component: EmpContractComponent;
  let fixture: ComponentFixture<EmpContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpContractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
