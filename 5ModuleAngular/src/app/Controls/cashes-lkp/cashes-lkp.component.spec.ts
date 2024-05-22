import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashesLkpComponent } from './cashes-lkp.component';

describe('CashesLkpComponent', () => {
  let component: CashesLkpComponent;
  let fixture: ComponentFixture<CashesLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashesLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashesLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
