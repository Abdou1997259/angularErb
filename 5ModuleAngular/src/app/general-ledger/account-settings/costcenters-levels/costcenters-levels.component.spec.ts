import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostcentersLevelsComponent } from './costcenters-levels.component';

describe('CostcentersLevelsComponent', () => {
  let component: CostcentersLevelsComponent;
  let fixture: ComponentFixture<CostcentersLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostcentersLevelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostcentersLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
