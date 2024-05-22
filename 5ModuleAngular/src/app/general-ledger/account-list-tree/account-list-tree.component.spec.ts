import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountListTreeComponent } from './account-list-tree.component';

describe('AccountListTreeComponent', () => {
  let component: AccountListTreeComponent;
  let fixture: ComponentFixture<AccountListTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountListTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountListTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
