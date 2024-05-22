import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankBranchAddComponent } from './bank-branch-add.component';

describe('BankBranchAddComponent', () => {
  let component: BankBranchAddComponent;
  let fixture: ComponentFixture<BankBranchAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankBranchAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankBranchAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
