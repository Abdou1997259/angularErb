import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankBranchesLkpComponent } from './bank-branches-lkp.component';

describe('BankBranchesLkpComponent', () => {
  let component: BankBranchesLkpComponent;
  let fixture: ComponentFixture<BankBranchesLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankBranchesLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankBranchesLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
