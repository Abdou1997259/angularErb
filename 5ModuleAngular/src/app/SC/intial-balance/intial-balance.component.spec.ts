import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntialBalanceComponent } from './intial-balance.component';

describe('IntialBalanceComponent', () => {
  let component: IntialBalanceComponent;
  let fixture: ComponentFixture<IntialBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntialBalanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntialBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
