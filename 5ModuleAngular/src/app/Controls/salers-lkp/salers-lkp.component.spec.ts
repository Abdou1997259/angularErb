import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalersLkpComponent } from './salers-lkp.component';

describe('SalersLkpComponent', () => {
  let component: SalersLkpComponent;
  let fixture: ComponentFixture<SalersLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalersLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalersLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
