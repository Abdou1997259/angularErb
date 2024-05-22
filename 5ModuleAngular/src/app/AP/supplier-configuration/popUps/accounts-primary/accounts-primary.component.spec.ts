import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsPrimaryComponent } from './accounts-primary.component';

describe('AccountsPrimaryComponent', () => {
  let component: AccountsPrimaryComponent;
  let fixture: ComponentFixture<AccountsPrimaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsPrimaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsPrimaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
