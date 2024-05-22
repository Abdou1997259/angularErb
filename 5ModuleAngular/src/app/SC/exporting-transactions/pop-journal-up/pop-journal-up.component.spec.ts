import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopJournalUpComponent } from './pop-journal-up.component';

describe('PopJournalUpComponent', () => {
  let component: PopJournalUpComponent;
  let fixture: ComponentFixture<PopJournalUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopJournalUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopJournalUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
