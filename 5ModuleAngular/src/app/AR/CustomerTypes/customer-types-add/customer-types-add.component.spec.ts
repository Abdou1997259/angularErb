import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTypesAddComponent } from './customer-types-add.component';

describe('CustomerTypesAddComponent', () => {
  let component: CustomerTypesAddComponent;
  let fixture: ComponentFixture<CustomerTypesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTypesAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTypesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
