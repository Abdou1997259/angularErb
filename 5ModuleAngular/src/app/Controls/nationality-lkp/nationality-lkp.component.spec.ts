import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalityLkpComponent } from './nationality-lkp.component';

describe('NationalityLkpComponent', () => {
  let component: NationalityLkpComponent;
  let fixture: ComponentFixture<NationalityLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalityLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalityLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
