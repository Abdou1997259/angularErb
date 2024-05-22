import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedAccountsLookUpComponent } from './related-accounts-look-up.component';

describe('RelatedAccountsLookUpComponent', () => {
  let component: RelatedAccountsLookUpComponent;
  let fixture: ComponentFixture<RelatedAccountsLookUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedAccountsLookUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedAccountsLookUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
