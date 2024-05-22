import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceLkpComponent } from './source-lkp.component';

describe('SourceLkpComponent', () => {
  let component: SourceLkpComponent;
  let fixture: ComponentFixture<SourceLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
