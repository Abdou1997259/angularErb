import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersLkpComponent } from './customers-lkp.component';

describe('CustomersLkpComponent', () => {
  let component: CustomersLkpComponent;
  let fixture: ComponentFixture<CustomersLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomersLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
