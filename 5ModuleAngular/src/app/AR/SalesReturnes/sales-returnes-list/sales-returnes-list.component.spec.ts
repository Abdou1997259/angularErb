import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReturnesListComponent } from './sales-returnes-list.component';

describe('SalesReturnesListComponent', () => {
  let component: SalesReturnesListComponent;
  let fixture: ComponentFixture<SalesReturnesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesReturnesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesReturnesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
