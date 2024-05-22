import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransSourceTypesComponent } from './trans-source-types.component';

describe('TransSourceTypesComponent', () => {
  let component: TransSourceTypesComponent;
  let fixture: ComponentFixture<TransSourceTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransSourceTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransSourceTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
