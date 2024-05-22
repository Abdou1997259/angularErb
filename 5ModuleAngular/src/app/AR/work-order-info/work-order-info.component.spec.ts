import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderInfoComponent } from './work-order-info.component';

describe('WorkOrderInfoComponent', () => {
  let component: WorkOrderInfoComponent;
  let fixture: ComponentFixture<WorkOrderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
