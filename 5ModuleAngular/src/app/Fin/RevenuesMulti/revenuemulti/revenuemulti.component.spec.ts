import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenuemultiComponent } from './revenuemulti.component';

describe('RevenuemultiComponent', () => {
  let component: RevenuemultiComponent;
  let fixture: ComponentFixture<RevenuemultiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenuemultiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenuemultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
