import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrenciesLkpComponent } from './currencies-lkp.component';

describe('CurrenciesLkpComponent', () => {
  let component: CurrenciesLkpComponent;
  let fixture: ComponentFixture<CurrenciesLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrenciesLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrenciesLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
