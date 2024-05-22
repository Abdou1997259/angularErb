import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressQuotationsComponent } from './press-quotations.component';

describe('PressQuotationsComponent', () => {
  let component: PressQuotationsComponent;
  let fixture: ComponentFixture<PressQuotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PressQuotationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PressQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
