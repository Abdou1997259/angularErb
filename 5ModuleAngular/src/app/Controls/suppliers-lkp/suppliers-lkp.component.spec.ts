import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersLkpComponent } from './suppliers-lkp.component';

describe('SuppliersLkpComponent', () => {
  let component: SuppliersLkpComponent;
  let fixture: ComponentFixture<SuppliersLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliersLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppliersLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
