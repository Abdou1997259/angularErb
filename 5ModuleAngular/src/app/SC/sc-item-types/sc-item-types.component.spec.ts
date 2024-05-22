import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScItemTypesComponent } from './sc-item-types.component';

describe('ScItemTypesComponent', () => {
  let component: ScItemTypesComponent;
  let fixture: ComponentFixture<ScItemTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScItemTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScItemTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
