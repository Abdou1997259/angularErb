import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerClassesListComponent } from './customer-classes-list.component';

describe('CustomerClassesListComponent', () => {
  let component: CustomerClassesListComponent;
  let fixture: ComponentFixture<CustomerClassesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerClassesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerClassesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
