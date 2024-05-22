import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPrevComponent } from './user-prev.component';

describe('UserPrevComponent', () => {
  let component: UserPrevComponent;
  let fixture: ComponentFixture<UserPrevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPrevComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPrevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
