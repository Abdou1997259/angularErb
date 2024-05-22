import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDirectionComponent } from './account-direction.component';

describe('AccountDirectionComponent', () => {
  let component: AccountDirectionComponent;
  let fixture: ComponentFixture<AccountDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountDirectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
