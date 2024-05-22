import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportingPopJournalUpComponent } from './importing-pop-journal-up.component';

describe('ImportingPopJournalUpComponent', () => {
  let component: ImportingPopJournalUpComponent;
  let fixture: ComponentFixture<ImportingPopJournalUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportingPopJournalUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportingPopJournalUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
