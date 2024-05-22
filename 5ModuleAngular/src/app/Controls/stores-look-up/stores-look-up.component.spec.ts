import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoresLookUpComponent } from './stores-look-up.component';

describe('StoresLookUpComponent', () => {
  let component: StoresLookUpComponent;
  let fixture: ComponentFixture<StoresLookUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoresLookUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoresLookUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
