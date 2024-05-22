import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansTransComponent } from './loans-trans.component';

describe('LoansTransComponent', () => {
  let component: LoansTransComponent;
  let fixture: ComponentFixture<LoansTransComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoansTransComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoansTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
