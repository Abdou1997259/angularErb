import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransJournalsComponent } from './trans-journals.component';

describe('TransJournalsComponent', () => {
  let component: TransJournalsComponent;
  let fixture: ComponentFixture<TransJournalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransJournalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransJournalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
