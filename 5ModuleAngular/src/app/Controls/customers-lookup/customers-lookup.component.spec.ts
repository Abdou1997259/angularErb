import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersLookupComponent } from './customers-lookup.component';

describe('CustomersLookupComponent', () => {
  let component: CustomersLookupComponent;
  let fixture: ComponentFixture<CustomersLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomersLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
