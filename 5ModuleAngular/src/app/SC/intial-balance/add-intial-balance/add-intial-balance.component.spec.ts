import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIntialBalanceComponent } from './add-intial-balance.component';

describe('AddIntialBalanceComponent', () => {
  let component: AddIntialBalanceComponent;
  let fixture: ComponentFixture<AddIntialBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIntialBalanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIntialBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
