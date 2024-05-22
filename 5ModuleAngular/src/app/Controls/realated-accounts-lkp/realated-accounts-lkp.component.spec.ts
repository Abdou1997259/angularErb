import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealatedAccountsLkpComponent } from './realated-accounts-lkp.component';

describe('RealatedAccountsLkpComponent', () => {
  let component: RealatedAccountsLkpComponent;
  let fixture: ComponentFixture<RealatedAccountsLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealatedAccountsLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealatedAccountsLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
