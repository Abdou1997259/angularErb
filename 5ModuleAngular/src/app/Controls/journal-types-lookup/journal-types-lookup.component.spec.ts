import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalTypesLookupComponent } from './journal-types-lookup.component';

describe('JournalTypesLookupComponent', () => {
  let component: JournalTypesLookupComponent;
  let fixture: ComponentFixture<JournalTypesLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournalTypesLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalTypesLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
