import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationRulesListComponent } from './vacation-rules-list.component';

describe('VacationRulesListComponent', () => {
  let component: VacationRulesListComponent;
  let fixture: ComponentFixture<VacationRulesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacationRulesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacationRulesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
