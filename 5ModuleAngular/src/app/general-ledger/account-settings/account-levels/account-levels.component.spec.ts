import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLevelsComponent } from './account-levels.component';

describe('AccountLevelsComponent', () => {
  let component: AccountLevelsComponent;
  let fixture: ComponentFixture<AccountLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountLevelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
