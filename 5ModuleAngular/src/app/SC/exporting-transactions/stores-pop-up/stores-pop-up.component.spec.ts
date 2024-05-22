import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoresPopUpComponent } from './stores-pop-up.component';

describe('StoresPopUpComponent', () => {
  let component: StoresPopUpComponent;
  let fixture: ComponentFixture<StoresPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoresPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoresPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
