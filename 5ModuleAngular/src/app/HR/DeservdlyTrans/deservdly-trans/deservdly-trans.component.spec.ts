import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeservdlyTransComponent } from './deservdly-trans.component';

describe('DeservdlyTransComponent', () => {
  let component: DeservdlyTransComponent;
  let fixture: ComponentFixture<DeservdlyTransComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeservdlyTransComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeservdlyTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
