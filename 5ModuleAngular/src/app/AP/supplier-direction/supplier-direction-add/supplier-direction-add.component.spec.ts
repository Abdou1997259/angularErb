import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierDirectionAddComponent } from './supplier-direction-add.component';

describe('SupplierDirectionAddComponent', () => {
  let component: SupplierDirectionAddComponent;
  let fixture: ComponentFixture<SupplierDirectionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierDirectionAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierDirectionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
