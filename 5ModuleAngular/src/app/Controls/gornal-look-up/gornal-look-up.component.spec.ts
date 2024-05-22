import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GornalLookUpComponent } from './gornal-look-up.component';

describe('GornalLookUpComponent', () => {
  let component: GornalLookUpComponent;
  let fixture: ComponentFixture<GornalLookUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GornalLookUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GornalLookUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
