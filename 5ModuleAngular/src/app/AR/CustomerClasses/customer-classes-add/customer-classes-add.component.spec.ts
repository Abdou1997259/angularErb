import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerClassesAddComponent } from './customer-classes-add.component';

describe('CustomerClassesAddComponent', () => {
  let component: CustomerClassesAddComponent;
  let fixture: ComponentFixture<CustomerClassesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerClassesAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerClassesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
