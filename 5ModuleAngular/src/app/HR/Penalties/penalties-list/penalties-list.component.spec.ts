import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltiesListComponent } from './penalties-list.component';

describe('PenaltiesListComponent', () => {
  let component: PenaltiesListComponent;
  let fixture: ComponentFixture<PenaltiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PenaltiesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
