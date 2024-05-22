import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierDirectionComponent } from './supplier-direction.component';

describe('SupplierDirectionComponent', () => {
  let component: SupplierDirectionComponent;
  let fixture: ComponentFixture<SupplierDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierDirectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
