import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainBankAddComponent } from './main-bank-add.component';

describe('MainBankAddComponent', () => {
  let component: MainBankAddComponent;
  let fixture: ComponentFixture<MainBankAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainBankAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainBankAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
