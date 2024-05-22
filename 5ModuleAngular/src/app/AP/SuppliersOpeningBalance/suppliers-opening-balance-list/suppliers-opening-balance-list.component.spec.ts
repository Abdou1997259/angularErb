import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersOpeningBalanceListComponent } from './suppliers-opening-balance-list.component';

describe('SuppliersOpeningBalanceListComponent', () => {
  let component: SuppliersOpeningBalanceListComponent;
  let fixture: ComponentFixture<SuppliersOpeningBalanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliersOpeningBalanceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppliersOpeningBalanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
