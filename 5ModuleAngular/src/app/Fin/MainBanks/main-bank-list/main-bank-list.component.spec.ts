import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainBankListComponent } from './main-bank-list.component';

describe('MainBankListComponent', () => {
  let component: MainBankListComponent;
  let fixture: ComponentFixture<MainBankListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainBankListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainBankListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
