import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoresLookupComponent } from './stores-lookup.component';

describe('StoresLookupComponent', () => {
  let component: StoresLookupComponent;
  let fixture: ComponentFixture<StoresLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoresLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoresLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
