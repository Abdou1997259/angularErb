import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCentersLkpComponent } from './cost-centers-lkp.component';

describe('CostCentersLkpComponent', () => {
  let component: CostCentersLkpComponent;
  let fixture: ComponentFixture<CostCentersLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCentersLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCentersLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
