import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GLComponent } from './gl.component';

describe('GLComponent', () => {
  let component: GLComponent;
  let fixture: ComponentFixture<GLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GLComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
