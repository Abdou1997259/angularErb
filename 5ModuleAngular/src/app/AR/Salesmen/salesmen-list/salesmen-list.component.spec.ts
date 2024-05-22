import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmenListComponent } from './salesmen-list.component';

describe('SalesmenListComponent', () => {
  let component: SalesmenListComponent;
  let fixture: ComponentFixture<SalesmenListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesmenListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesmenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
