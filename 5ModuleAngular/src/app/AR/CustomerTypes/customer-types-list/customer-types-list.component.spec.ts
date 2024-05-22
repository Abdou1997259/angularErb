import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTypesListComponent } from './customer-types-list.component';

describe('CustomerTypesListComponent', () => {
  let component: CustomerTypesListComponent;
  let fixture: ComponentFixture<CustomerTypesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTypesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
