import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesConfigurationComponent } from './sales-configuration.component';

describe('SalesConfigurationComponent', () => {
  let component: SalesConfigurationComponent;
  let fixture: ComponentFixture<SalesConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
