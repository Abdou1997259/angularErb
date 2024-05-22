import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsLookupComponent } from './accounts-lookup.component';

describe('AccountsLookupComponent', () => {
  let component: AccountsLookupComponent;
  let fixture: ComponentFixture<AccountsLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
