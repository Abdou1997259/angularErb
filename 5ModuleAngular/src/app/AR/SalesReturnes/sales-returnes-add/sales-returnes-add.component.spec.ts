import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReturnesAddComponent } from './sales-returnes-add.component';

describe('SalesReturnesAddComponent', () => {
  let component: SalesReturnesAddComponent;
  let fixture: ComponentFixture<SalesReturnesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesReturnesAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesReturnesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
