import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsLookUpComponent } from './units-look-up.component';

describe('UnitsLookUpComponent', () => {
  let component: UnitsLookUpComponent;
  let fixture: ComponentFixture<UnitsLookUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitsLookUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitsLookUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
