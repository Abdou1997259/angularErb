import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationAddComponent } from './vacation-add.component';

describe('VacationAddComponent', () => {
  let component: VacationAddComponent;
  let fixture: ComponentFixture<VacationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacationAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
