import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsTreeComponent } from './accounts-tree.component';

describe('AccountsTreeComponent', () => {
  let component: AccountsTreeComponent;
  let fixture: ComponentFixture<AccountsTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
