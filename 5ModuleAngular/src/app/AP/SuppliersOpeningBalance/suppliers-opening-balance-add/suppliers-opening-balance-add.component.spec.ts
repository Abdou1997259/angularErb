import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersOpeningBalanceAddComponent } from './suppliers-opening-balance-add.component';

describe('SuppliersOpeningBalanceAddComponent', () => {
  let component: SuppliersOpeningBalanceAddComponent;
  let fixture: ComponentFixture<SuppliersOpeningBalanceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliersOpeningBalanceAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppliersOpeningBalanceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
