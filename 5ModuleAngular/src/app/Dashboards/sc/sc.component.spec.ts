import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SCComponent } from './sc.component';

describe('SCComponent', () => {
  let component: SCComponent;
  let fixture: ComponentFixture<SCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
