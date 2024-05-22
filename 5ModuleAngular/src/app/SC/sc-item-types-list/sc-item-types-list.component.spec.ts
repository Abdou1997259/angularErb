import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScItemTypesListComponent } from './sc-item-types-list.component';

describe('ScItemTypesListComponent', () => {
  let component: ScItemTypesListComponent;
  let fixture: ComponentFixture<ScItemTypesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScItemTypesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScItemTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
