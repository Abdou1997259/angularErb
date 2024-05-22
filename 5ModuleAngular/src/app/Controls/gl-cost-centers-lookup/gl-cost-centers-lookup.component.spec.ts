import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlCostCentersLookupComponent } from './gl-cost-centers-lookup.component';

describe('GlCostCentersLookupComponent', () => {
  let component: GlCostCentersLookupComponent;
  let fixture: ComponentFixture<GlCostCentersLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlCostCentersLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlCostCentersLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
