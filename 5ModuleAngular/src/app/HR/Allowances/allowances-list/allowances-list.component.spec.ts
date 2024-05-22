import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowancesListComponent } from './allowances-list.component';

describe('AllowancesListComponent', () => {
  let component: AllowancesListComponent;
  let fixture: ComponentFixture<AllowancesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllowancesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllowancesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
