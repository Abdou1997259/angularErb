import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDirectionAddComponent } from './sales-direction-add.component';

describe('SalesDirectionAddComponent', () => {
  let component: SalesDirectionAddComponent;
  let fixture: ComponentFixture<SalesDirectionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesDirectionAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesDirectionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
