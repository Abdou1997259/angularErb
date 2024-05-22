import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenuemultiListComponent } from './revenuemulti-list.component';

describe('RevenuemultiListComponent', () => {
  let component: RevenuemultiListComponent;
  let fixture: ComponentFixture<RevenuemultiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenuemultiListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenuemultiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
