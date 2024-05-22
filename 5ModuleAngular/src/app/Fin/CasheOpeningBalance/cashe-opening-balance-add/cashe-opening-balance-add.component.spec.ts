import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasheOpeningBalanceAddComponent } from './cashe-opening-balance-add.component';

describe('CasheOpeningBalanceAddComponent', () => {
  let component: CasheOpeningBalanceAddComponent;
  let fixture: ComponentFixture<CasheOpeningBalanceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasheOpeningBalanceAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasheOpeningBalanceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
