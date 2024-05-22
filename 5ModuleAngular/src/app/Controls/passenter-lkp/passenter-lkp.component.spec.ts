import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassenterLkpComponent } from './passenter-lkp.component';

describe('PassenterLkpComponent', () => {
  let component: PassenterLkpComponent;
  let fixture: ComponentFixture<PassenterLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassenterLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassenterLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
