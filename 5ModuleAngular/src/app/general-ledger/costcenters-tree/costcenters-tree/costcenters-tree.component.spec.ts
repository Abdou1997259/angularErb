import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostcentersTreeComponent } from './costcenters-tree.component';

describe('CostcentersTreeComponent', () => {
  let component: CostcentersTreeComponent;
  let fixture: ComponentFixture<CostcentersTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostcentersTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostcentersTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
