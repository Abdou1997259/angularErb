import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpContractListComponent } from './emp-contract-list.component';

describe('EmpContractListComponent', () => {
  let component: EmpContractListComponent;
  let fixture: ComponentFixture<EmpContractListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpContractListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpContractListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
