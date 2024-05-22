import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DedcutionCategoryAddComponent } from './dedcution-category-add.component';

describe('DedcutionCategoryAddComponent', () => {
  let component: DedcutionCategoryAddComponent;
  let fixture: ComponentFixture<DedcutionCategoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DedcutionCategoryAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DedcutionCategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
