import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsPopUpComponent } from './accounts-pop-up.component';

describe('AccountsPopUpComponent', () => {
  let component: AccountsPopUpComponent;
  let fixture: ComponentFixture<AccountsPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
