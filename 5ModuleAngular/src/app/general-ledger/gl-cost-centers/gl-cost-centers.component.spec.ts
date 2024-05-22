import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlCostCentersComponent } from './gl-cost-centers.component';

describe('GlCostCentersComponent', () => {
  let component: GlCostCentersComponent;
  let fixture: ComponentFixture<GlCostCentersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlCostCentersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlCostCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
