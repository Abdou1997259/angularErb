import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScItemMaingroupComponent } from './sc-item-maingroup.component';

describe('ScItemMaingroupComponent', () => {
  let component: ScItemMaingroupComponent;
  let fixture: ComponentFixture<ScItemMaingroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScItemMaingroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScItemMaingroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
