import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationRulesComponent } from './vacation-rules.component';

describe('VacationRulesComponent', () => {
  let component: VacationRulesComponent;
  let fixture: ComponentFixture<VacationRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacationRulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacationRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
