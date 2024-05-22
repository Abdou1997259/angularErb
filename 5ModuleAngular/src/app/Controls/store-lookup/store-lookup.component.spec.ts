import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreLookupComponent } from './store-lookup.component';

describe('StoreLookupComponent', () => {
  let component: StoreLookupComponent;
  let fixture: ComponentFixture<StoreLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
