import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDirectionComponent } from './sales-direction.component';

describe('SalesDirectionComponent', () => {
  let component: SalesDirectionComponent;
  let fixture: ComponentFixture<SalesDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesDirectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
