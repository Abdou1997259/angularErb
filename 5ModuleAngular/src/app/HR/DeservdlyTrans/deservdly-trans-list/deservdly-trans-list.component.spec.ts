import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeservdlyTransListComponent } from './deservdly-trans-list.component';

describe('DeservdlyTransListComponent', () => {
  let component: DeservdlyTransListComponent;
  let fixture: ComponentFixture<DeservdlyTransListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeservdlyTransListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeservdlyTransListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
