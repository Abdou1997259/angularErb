import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmenAddComponent } from './salesmen-add.component';

describe('SalesmenAddComponent', () => {
  let component: SalesmenAddComponent;
  let fixture: ComponentFixture<SalesmenAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesmenAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesmenAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
