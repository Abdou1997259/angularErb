import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookUpComponent } from './look-up-ar.component';

describe('LookUpComponent', () => {
  let component: LookUpComponent;
  let fixture: ComponentFixture<LookUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LookUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
