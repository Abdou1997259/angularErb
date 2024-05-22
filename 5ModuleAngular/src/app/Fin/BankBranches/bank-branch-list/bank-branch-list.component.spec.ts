import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankBranchListComponent } from './bank-branch-list.component';

describe('BankBranchListComponent', () => {
  let component: BankBranchListComponent;
  let fixture: ComponentFixture<BankBranchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankBranchListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankBranchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
