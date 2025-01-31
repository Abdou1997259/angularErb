import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierTypeComponent } from './add-supplier-type.component';

describe('AddSupplierTypeComponent', () => {
  let component: AddSupplierTypeComponent;
  let fixture: ComponentFixture<AddSupplierTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSupplierTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSupplierTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
