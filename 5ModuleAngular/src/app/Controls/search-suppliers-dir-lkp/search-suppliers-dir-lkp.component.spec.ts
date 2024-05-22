import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSuppliersDirLkpComponent } from './search-suppliers-dir-lkp.component';

describe('SearchSuppliersDirLkpComponent', () => {
  let component: SearchSuppliersDirLkpComponent;
  let fixture: ComponentFixture<SearchSuppliersDirLkpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSuppliersDirLkpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchSuppliersDirLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
