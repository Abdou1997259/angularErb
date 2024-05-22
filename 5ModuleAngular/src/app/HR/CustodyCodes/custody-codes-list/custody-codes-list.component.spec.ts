import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustodyCodesListComponent } from './custody-codes-list.component';

describe('CustodyCodesListComponent', () => {
  let component: CustodyCodesListComponent;
  let fixture: ComponentFixture<CustodyCodesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustodyCodesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustodyCodesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
