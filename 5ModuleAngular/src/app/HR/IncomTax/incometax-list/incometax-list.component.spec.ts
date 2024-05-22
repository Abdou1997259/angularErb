import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncometaxListComponent } from './incometax-list.component';

describe('IncometaxListComponent', () => {
  let component: IncometaxListComponent;
  let fixture: ComponentFixture<IncometaxListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncometaxListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncometaxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
