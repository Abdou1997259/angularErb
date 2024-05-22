import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersTypesLkpComponent } from './suppliers-types-lkp.component';

describe('SuppliersTypesLkpComponent', () => {
  let component: SuppliersTypesLkpComponent;
  let fixture: ComponentFixture<SuppliersTypesLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliersTypesLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppliersTypesLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
