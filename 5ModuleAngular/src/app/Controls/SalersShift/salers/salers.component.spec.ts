import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalersComponent } from './salers.component';

describe('SalersComponent', () => {
  let component: SalersComponent;
  let fixture: ComponentFixture<SalersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
