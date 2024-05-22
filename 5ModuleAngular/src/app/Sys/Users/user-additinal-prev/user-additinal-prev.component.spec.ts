import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdditinalPrevComponent } from './user-additinal-prev.component';

describe('UserAdditinalPrevComponent', () => {
  let component: UserAdditinalPrevComponent;
  let fixture: ComponentFixture<UserAdditinalPrevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAdditinalPrevComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAdditinalPrevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
