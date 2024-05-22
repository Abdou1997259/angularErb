import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashesComponent } from './cashes.component';

describe('CashesComponent', () => {
  let component: CashesComponent;
  let fixture: ComponentFixture<CashesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
