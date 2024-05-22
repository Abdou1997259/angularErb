import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansTransListComponent } from './loans-trans-list.component';

describe('LoansTransListComponent', () => {
  let component: LoansTransListComponent;
  let fixture: ComponentFixture<LoansTransListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoansTransListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoansTransListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
