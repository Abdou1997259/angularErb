import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FINComponent } from './fin.component';

describe('FINComponent', () => {
  let component: FINComponent;
  let fixture: ComponentFixture<FINComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FINComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FINComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
