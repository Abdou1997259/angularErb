import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleschartsComponent } from './salescharts.component';

describe('SaleschartsComponent', () => {
  let component: SaleschartsComponent;
  let fixture: ComponentFixture<SaleschartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleschartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleschartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
