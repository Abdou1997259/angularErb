import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasheOpeningBalanceListComponent } from './cashe-opening-balance-list.component';

describe('CasheOpeningBalanceListComponent', () => {
  let component: CasheOpeningBalanceListComponent;
  let fixture: ComponentFixture<CasheOpeningBalanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasheOpeningBalanceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasheOpeningBalanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
