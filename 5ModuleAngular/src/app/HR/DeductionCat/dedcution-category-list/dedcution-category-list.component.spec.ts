import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DedcutionCategoryListComponent } from './dedcution-category-list.component';

describe('DedcutionCategoryListComponent', () => {
  let component: DedcutionCategoryListComponent;
  let fixture: ComponentFixture<DedcutionCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DedcutionCategoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DedcutionCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
