import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostcentersLookupComponent } from './costcenters-lookup.component';

describe('CostcentersLookupComponent', () => {
  let component: CostcentersLookupComponent;
  let fixture: ComponentFixture<CostcentersLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostcentersLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostcentersLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
