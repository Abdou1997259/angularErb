import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeservedlyComponent } from './deservedly.component';

describe('DeservedlyComponent', () => {
  let component: DeservedlyComponent;
  let fixture: ComponentFixture<DeservedlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeservedlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeservedlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
