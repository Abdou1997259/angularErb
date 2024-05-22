import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinConfigurationComponent } from './fin-configuration.component';

describe('FinConfigurationComponent', () => {
  let component: FinConfigurationComponent;
  let fixture: ComponentFixture<FinConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
